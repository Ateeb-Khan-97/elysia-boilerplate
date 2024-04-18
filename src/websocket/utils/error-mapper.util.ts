import { ZodError } from 'zod';
import { zodErrorMapper } from '../../common/mappers/zod.mapper';

export function errorMapper(error: any) {
  if (error instanceof ZodError) {
    return { message: zodErrorMapper(error), success: false };
  }

  return { message: error.message, success: false };
}
