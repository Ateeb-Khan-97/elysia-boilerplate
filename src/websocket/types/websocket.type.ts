import { IUser } from '../../common/functions/jwt.function';
import type {
  IWebSocketRequestType,
  IWebSocketResponseType,
} from '../schema/websocket.schema';

export type WS = {
  id: string;
  send: (data: IWebSocketResponseType) => {};
  terminate: () => void;
  data: { body: any; params: any; query: any };
  close: () => {};
};

export type WsContext = {
  user: IUser;
  ws: WS;
  body: IWebSocketRequestType;
};
