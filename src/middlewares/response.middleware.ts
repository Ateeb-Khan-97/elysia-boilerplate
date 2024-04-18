import { AfterHandler } from 'elysia';
import { Response } from '../common/mappers/response.mapper';

export const responseHandler: AfterHandler = (c) =>
  Response.map({ c, response: c.response });
