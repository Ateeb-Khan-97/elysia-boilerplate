import jsonwebtoken from 'jsonwebtoken';
import { ENV, isDev } from '../../utils/env.util';
import { User } from '@prisma/client';

export type IUser = Omit<
  User,
  'password' | '_count' | 'createdAt' | 'updatedAt'
>;

export default function JsonWebToken() {
  /**
   * @param token jwt-access-token to verify with secret-key
   * @returns user object with user details
   */
  async function accessTokenVerify(token: string) {
    const maxAge = isDev() ? '24h' : ENV.ACCESS_TOKEN_AGE;

    return jsonwebtoken.verify(token, ENV.ACCESS_TOKEN_SECRET, {
      maxAge,
    }) as IUser;
  }

  /**
   * @param payload user object to create jwt-refresh-token
   * @returns jwt-access-token
   */
  async function accessTokenSign(payload: IUser) {
    return jsonwebtoken.sign(payload, ENV.ACCESS_TOKEN_SECRET, {
      algorithm: 'HS512',
    });
  }

  /**
   * @param token jwt-refresh-token to verify with secret-key
   * @returns user object with user details
   */
  async function refreshTokenVerify(token: string) {
    const maxAge = isDev() ? '24h' : ENV.REFRESH_TOKEN_AGE;

    return jsonwebtoken.verify(token, ENV.REFRESH_TOKEN_SECRET, {
      maxAge,
    }) as IUser;
  }

  /**
   * @param payload user object to create jwt-refresh-token
   * @returns jwt-refresh-token
   */
  async function refreshTokenSign(payload: IUser) {
    return jsonwebtoken.sign(payload, ENV.REFRESH_TOKEN_SECRET, {
      algorithm: 'HS512',
    });
  }

  return {
    accessTokenSign,
    accessTokenVerify,
    refreshTokenSign,
    refreshTokenVerify,
  };
}
