import type { Context } from '@/common/types/controller.type';
import {
  ApiTag,
  BodyValidator,
  Controller,
  Post,
  Public,
} from '@/utils/decorators.util';
import { BadRequestException, NotFoundException } from '@/utils/exception.util';
import { AuthDto, AuthSchemas } from '@/modules/auth/schema/auth.schema';

import JsonWebToken from '@/common/functions/jwt.function';
import { AUTH_MESSAGES } from '@/modules/auth/constant/auth.constant';
import { HttpStatus } from '@/utils/http-status.util';

import { authService } from '@/modules/auth/auth.service';
import { userService } from '@/modules/users/user.service';
import { CommonService } from '@/common/functions/common.functions';
import { LoggerService } from '@/utils/logger.util';

@Controller('/auth')
@ApiTag('Auth')
export class AuthController {
  private readonly logger = LoggerService();
  private readonly tokenService = JsonWebToken();
  private readonly commonService = CommonService();

  @BodyValidator(AuthSchemas.SignInSchema)
  @Post('/sign-in')
  @Public()
  async signInHandler(c: Context<AuthDto.ISignInDto>) {
    const userRecord = await userService.findByUnique({ email: c.body.email });
    if (!userRecord) throw new NotFoundException(AUTH_MESSAGES.NOT_FOUND);
    if (userRecord.password != c.body.password)
      throw new BadRequestException(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const user = this.commonService.exclude(userRecord, [
      'createdAt',
      'updatedAt',
      'password',
      'session',
    ]);

    const accessToken = await this.tokenService.accessTokenSign(user);
    const refreshToken = await this.tokenService.refreshTokenSign(user);

    await authService.upsertSession(refreshToken, user.id);
    return { user, accessToken, refreshToken };
  }

  @BodyValidator(AuthSchemas.SignUpSchema)
  @Post('/sign-up')
  @Public()
  async signUpHandler({ body }: Context<AuthDto.ISignUpDto>) {
    const user = await userService.findByUnique({ email: body.email });
    if (user) throw new BadRequestException(AUTH_MESSAGES.EMAIL_EXISTS);

    const { message, success } = this.commonService.passwordValidator(
      body.password,
    );

    if (!success) throw new BadRequestException(message);

    try {
      await userService.create(body);
      return {
        status: HttpStatus.CREATED,
        message: AUTH_MESSAGES.SIGN_UP_SUCCESS,
      };
    } catch (err) {
      throw new BadRequestException(AUTH_MESSAGES.SIGN_UP_FAILED);
    }
  }

  @BodyValidator(AuthSchemas.RefreshSchema)
  @Post('/refresh')
  @Public()
  async refreshHandler(c: Context<AuthDto.IRefreshTokenDto>) {
    const session = await authService.findSession({
      refreshToken: c.body.refreshToken,
    });
    if (!session) throw new NotFoundException(AUTH_MESSAGES.SESSION_NOT_FOUND);

    try {
      const user = await this.tokenService.refreshTokenVerify(
        c.body.refreshToken,
      );

      delete user['iat'];
      delete user['exp'];

      const accessToken = await this.tokenService.accessTokenSign(user);
      const refreshToken = await this.tokenService.refreshTokenSign(user);

      await authService.updateSession(refreshToken, user.id);

      return { user, accessToken, refreshToken };
    } catch (err) {
      this.logger.error(err.message);
      throw new BadRequestException(AUTH_MESSAGES.REFRESH_FAILED);
    }
  }
}
