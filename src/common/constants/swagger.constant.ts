import type { ElysiaSwaggerConfig } from '@elysiajs/swagger/dist/types';

export const SWAGGER_CONFIG: ElysiaSwaggerConfig<any> = {
  provider: 'swagger-ui',
  autoDarkMode: false,
  documentation: {
    info: {
      title: 'Elysia bootstrap',
      version: '1.0',
      description: 'API documentation for Elysia bootstrap',
    },
    security: [{ BearerAuth: [] }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
  },
};
