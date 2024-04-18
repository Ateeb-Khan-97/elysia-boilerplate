export type Context<T = any> = {
  body: T;
  query: T;
  params: T;
  currentUserId: number;
};
