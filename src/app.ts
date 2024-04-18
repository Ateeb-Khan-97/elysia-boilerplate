import type { Elysia } from 'elysia';

import { AuthController } from '@/modules/auth/auth.controller';
import { UserController } from '@/modules/users/user.controller';

const controllersArray = [AuthController, UserController] as any[];

export function AppModule(app: Elysia, basePath = '/api') {
  for (const Controller of controllersArray)
    app.group(basePath, Controller().routes);
}
