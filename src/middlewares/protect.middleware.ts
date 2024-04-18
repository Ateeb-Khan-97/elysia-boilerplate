import type { Context } from 'elysia';

import { UnauthorizedException } from '../utils/exception.util';
import JsonWebToken from '../common/functions/jwt.function';

export const protect = async (c: Context): Promise<number> => {
  const authorizationHeader = c.request.headers.get('Authorization');
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException();
  }
  const [, token] = authorizationHeader.split(' ');
  if (!token) throw new UnauthorizedException();

  try {
    const user = await JsonWebToken().accessTokenVerify(token);
    return user.id;
  } catch (error) {
    throw new UnauthorizedException();
  }
};
