import { z } from 'zod';
import { HttpStatus } from '../../utils/http-status.util';

export const WebSocketResponseSchema = z.object({
  message: z.string().default(HttpStatus.OK_MESSAGE),
  success: z.boolean().default(true),
  data: z.any().default({}),
});
export type IWebSocketResponseType = z.infer<typeof WebSocketResponseSchema>;

export const WebSocketRequestSchema = z.object({
  payload: z.any().default({}),
  type: z.enum(['assistant-req']),
});
export type IWebSocketRequestType = z.infer<typeof WebSocketRequestSchema>;
