import "@fastify/jwt";

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    payload: {
      kind: any;
      sub: any;
    };
  }
}
