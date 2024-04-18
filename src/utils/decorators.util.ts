import type { Elysia, TSchema } from 'elysia';
import { LoggerService } from './logger.util';
import { protect } from '../middlewares/protect.middleware';
import { Context } from '../common/types/controller.type';

interface IFuncType {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
  value: Function;
  schema?: TSchema;
  paramSchema?: TSchema;
  querySchema?: TSchema;
  public?: true;
}

console.clear();

export const Controller = (base: string) => {
  const logger = LoggerService();
  return function (constructor: any) {
    logger.log(constructor.name, 'loaded');
    const newConstructor = function (...args: any[]) {
      const result = Reflect.construct(constructor, args, newConstructor);

      result['routes'] = function (app: Elysia) {
        (constructor._routes as IFuncType[]).forEach((each) => {
          each.value = each.value.bind(result);

          (app as any)[each.method](
            `${base}${each.path}`,
            async (c) => {
              const context: Context = {
                body: c.body ?? {},
                params: c.params ?? {},
                query: c.query ?? {},
                currentUserId: undefined,
              };
              if (!each.public) {
                const userId = await protect(c);
                context['currentUserId'] = userId;
              }

              return await each.value(context);
            },
            {
              detail: { tags: constructor.tag ? [constructor.tag] : undefined },
              body: each.schema,
              query: each.querySchema as any,
              params: each.paramSchema as any,
            },
          );
        });
        return app;
      };

      return result;
    };

    return newConstructor as any;
  };
};

const validateMetaData = (target: any) => {
  if (!target.constructor._routes) {
    target.constructor._routes = [];
  }
};

const filterMetadata = (
  funcs: PropertyDescriptor[],
  newFunction: PropertyDescriptor,
) => {
  const index = funcs.findIndex(
    (eachFunc) => eachFunc.value.name == newFunction.value.name,
  );

  if (index == -1) {
    funcs.push(newFunction);
  } else {
    funcs[index] = { ...funcs[index], ...newFunction };
  }
};

export const ApiTag = (tag: string) => {
  return function (constructor: any) {
    constructor['tag'] = tag;
  };
};

export const Public = () => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['public'] = true;

    validateMetaData(target);
    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const Get = (path: string = '/') => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['path'] = path;
    (descriptor as any)['method'] = 'get';

    validateMetaData(target);

    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const Post = (path: string = '/') => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['path'] = path;
    (descriptor as any)['method'] = 'post';

    validateMetaData(target);

    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const Patch = (path: string = '/') => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['path'] = path;
    (descriptor as any)['method'] = 'patch';

    validateMetaData(target);

    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const Put = (path: string = '/') => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['path'] = path;
    (descriptor as any)['method'] = 'put';

    validateMetaData(target);

    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const Delete = (path: string = '/') => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['path'] = path;
    (descriptor as any)['method'] = 'delete';

    validateMetaData(target);

    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const QueryValidator = (schema: TSchema) => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['querySchema'] = schema;

    validateMetaData(target);
    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const BodyValidator = (schema: TSchema) => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['schema'] = schema;

    validateMetaData(target);
    filterMetadata(target.constructor._routes, descriptor);
  };
};

export const ParamValidator = (schema: TSchema) => {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    (descriptor as any)['paramSchema'] = schema;

    validateMetaData(target);
    filterMetadata(target.constructor._routes, descriptor);
  };
};
