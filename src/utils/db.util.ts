import { isProd } from '@/utils/env.util';
import { PrismaClient } from '@prisma/client';

let db: PrismaClient;

if (!(global as any).db) {
  (global as any).db = new PrismaClient({
    log: isProd() ? undefined : ['error', 'info', 'query', 'warn'],
  });
}

db = (global as any).db as PrismaClient;

export default db;
