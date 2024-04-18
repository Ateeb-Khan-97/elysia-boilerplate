import { z } from 'zod';
import { zodErrorMapper } from '../common/mappers/zod.mapper';
import { LoggerService } from './logger.util';

/** Add env variables here... */
const envSchema = z.object({
  NODE_ENV: z
    .enum(['production', 'development', 'local', 'staging'])
    .default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string().default('SECRET'),
  ACCESS_TOKEN_AGE: z.string().default('24h'),
  REFRESH_TOKEN_SECRET: z.string().default('SECRET'),
  REFRESH_TOKEN_AGE: z.string().default('24h'),
});

/** Don't touch this code */
type IEnv = z.infer<typeof envSchema>;
function envInitializer(): IEnv {
  try {
    return envSchema.parse(Bun.env);
  } catch (err) {
    LoggerService(envInitializer.name.toUpperCase()).error(zodErrorMapper(err));
    process.exit(1);
  }
}
export const ENV = envInitializer();
export const isDev = () => ENV.NODE_ENV == 'development';
export const isProd = () => ENV.NODE_ENV == 'production';
export const isLocal = () => ENV.NODE_ENV == 'local';
export const isStaging = () => ENV.NODE_ENV == 'staging';
