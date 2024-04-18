import { ZodError } from 'zod';

export function zodErrorMapper(err: ZodError): string {
  return `${err.errors[0].path[0]} ${err.errors[0].message}`;
}
