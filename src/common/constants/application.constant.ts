import { ENV } from '../../utils/env.util';

export const APPLICATION_CONSTANTS = {
  PORT: ENV.PORT,
  BOOTSTRAP_MESSAGE: `Application running at http://localhost:${ENV.PORT}`,
};
