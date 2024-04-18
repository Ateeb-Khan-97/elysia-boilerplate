import { Prisma } from '@prisma/client';
import db from '../../utils/db.util';
import { LoggerService } from '../../utils/logger.util';

class UserService {
  private readonly logger = LoggerService(UserService.name);

  async findById(id: number, select?: Prisma.UserSelect) {
    return this.findByUnique({ id }, select);
  }

  async findByUnique(
    where: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect,
  ) {
    return await db.user.findUnique({ where, select });
  }

  async findAll(where?: Prisma.UserWhereUniqueInput) {
    return db.user.findMany({ where });
  }

  async create(data: Prisma.UserCreateInput) {
    try {
      return await db.user.create({ data });
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }
}

export const userService = new UserService();
