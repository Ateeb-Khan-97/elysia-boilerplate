import { Prisma } from '@prisma/client';
import db from '../../utils/db.util';

class AuthService {
  async findSession(where: Prisma.SessionWhereUniqueInput) {
    return db.session.findUnique({ where });
  }

  async upsertSession(refreshToken: string, userId: number) {
    const session = await this.findSession({ userId });

    if (session) return await this.updateSession(refreshToken, userId);
    return await this.createSession(refreshToken, userId);
  }

  async updateSession(refreshToken: string, userId: number) {
    return db.session.update({ data: { refreshToken }, where: { userId } });
  }

  async createSession(refreshToken: string, userId: number) {
    return db.session.create({ data: { refreshToken, userId } });
  }
}

export const authService = new AuthService();
