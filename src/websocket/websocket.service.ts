import type { WsContext } from './types/websocket.type';
import { LoggerService } from '../utils/logger.util';
import { CommonService } from '../common/functions/common.functions';

export class WebsocketService {
  private readonly logger = LoggerService(WebsocketService.name);
  private readonly commonService = CommonService();

  public async requestHandler({ body, user, ws }: WsContext) {
    console.log(body);
  }
}
