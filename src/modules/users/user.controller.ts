import type { Context } from '../../common/types/controller.type';

import { ApiTag, Controller, Get } from '../../utils/decorators.util';
import { CommonService } from '../../common/functions/common.functions';
import { userService } from './user.service';
import { authService } from '../auth/auth.service';

@Controller('/user')
@ApiTag('User')
export class UserController {
  private readonly commonService = CommonService();

  @Get('/me')
  async getAllHandler({ currentUserId }: Context) {
    const user = await userService.findById(currentUserId);
    const session = await authService.findSession({ userId: user.id });

    user['refreshToken'] = session.refreshToken;

    return this.commonService.exclude(user, ['password']);
  }
}
