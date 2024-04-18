import { ErrorHandler, NotFoundError, ValidationError } from 'elysia';
import { HttpStatus } from '../utils/http-status.util';
import { HttpException } from '../utils/exception.util';
import { ZodError } from 'zod';
import { Response } from '../common/mappers/response.mapper';
import { zodErrorMapper } from '../common/mappers/zod.mapper';

export const errorHandler: ErrorHandler = (c) => {
  const response = {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: c.error.message ?? HttpStatus.INTERNAL_SERVER_ERROR_MESSAGE,
  };

  if (c.error instanceof HttpException) {
    response.message = c.error.message;
    response.status = c.error.status;
  }

  if (c.error instanceof ZodError) {
    response.status = HttpStatus.BAD_REQUEST;
    response.message = zodErrorMapper(c.error);
  }

  if (c.error instanceof NotFoundError) {
    const pathname = new URL(c.request.url).pathname;
    const method = c.request.method;

    response['message'] = `Cannot ${method} ${pathname}`;
    response['status'] = HttpStatus.NOT_FOUND;
  }

  if (c.error instanceof ValidationError) {
    const error = c.error.all[0];
    const field = c.body ? error.path.replace('/', '') : 'request body';
    const message = (error.message as string).toLowerCase();

    response['message'] = `Field ${field} is ${message}`;
    response['status'] = HttpStatus.BAD_REQUEST;
  }

  return Response.map({ c: c as any, response });
};
