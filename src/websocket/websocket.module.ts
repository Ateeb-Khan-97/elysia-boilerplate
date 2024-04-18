import type { Elysia } from 'elysia';
import JsonWebToken, { type IUser } from '../common/functions/jwt.function';

import { WebSocketRequestSchema } from './schema/websocket.schema';
import { WEBSOCKET_MESSAGES } from './constant/websocket.constant';
import { WebsocketService } from './websocket.service';
import { errorMapper } from './utils/error-mapper.util';

import { LoggerService } from '../utils/logger.util';

export function WebsocketModule(app: Elysia, base = '/ws') {
  const clients = new Map<string, IUser>();
  const websocketService = new WebsocketService();
  const logger = LoggerService(WebsocketModule.name);

  app.ws(base, {
    /**
     * Auth verification before connection to websocket
     */
    open: async (ws) => {
      try {
        const token = ws.data.query.token;
        const user = await JsonWebToken().accessTokenVerify(token);
        clients.set(ws.id, user);

        ws.send({ message: WEBSOCKET_MESSAGES.WELCOME, data: { id: ws.id } });
      } catch (error) {
        logger.error(error);
        ws.send({ message: WEBSOCKET_MESSAGES.UNAUTHORIZED, success: false });
        ws.close();
      }
    },
    /**
     * To handle messages
     */
    message: async (ws, message) => {
      try {
        const body = WebSocketRequestSchema.parse(message);
        const user = clients.get(ws.id);
        if (!user) throw new Error(WEBSOCKET_MESSAGES.CLIENT_NOT_FOUND);

        await websocketService.requestHandler({ body, user, ws });
      } catch (error) {
        logger.error(error);
        ws.send(errorMapper(error));
      }
    },
    /**
     * To delete client from clientMap on close
     */
    close: (ws) => {
      clients.delete(ws.id);
    },
  });
}
