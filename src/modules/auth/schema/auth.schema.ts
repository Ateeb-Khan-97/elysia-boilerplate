import { t } from 'elysia';

export class AuthSchemas {
  static readonly SignInSchema = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String(),
  });

  static readonly SignUpSchema = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String(),
  });

  static readonly RefreshSchema = t.Object({
    refreshToken: t.String(),
  });
}

export namespace AuthDto {
  export type ISignInDto = typeof AuthSchemas.SignInSchema.static;
  export type ISignUpDto = typeof AuthSchemas.SignUpSchema.static;
  export type IRefreshTokenDto = typeof AuthSchemas.RefreshSchema.static;
}
