import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { errorHandler } from '@/middlewares/error.middleware';
import { responseHandler } from '@/middlewares/response.middleware';

import { SWAGGER_CONFIG } from '@/common/constants/swagger.constant';
import { APPLICATION_CONSTANTS } from '@/common/constants/application.constant';

import { LoggerService } from '@/utils/logger.util';

import { AppModule } from '@/app';
import { WebsocketModule } from '@/websocket/websocket.module';
import { ENV, isProd } from './utils/env.util';

const app = new Elysia();

if (!isProd()) app.use(swagger(SWAGGER_CONFIG));
app.use(cors());

app.onError(errorHandler);
app.onAfterHandle(responseHandler);

WebsocketModule(app);
AppModule(app);

app.listen(ENV.PORT, async () => {
  LoggerService().log(APPLICATION_CONSTANTS.BOOTSTRAP_MESSAGE);
});
