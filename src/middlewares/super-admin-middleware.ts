import { ForbiddenError } from "@/errors/forbidden-error";
import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

export const permissionMiddleware = (requiredPermissions: string[]) =>
  fastifyPlugin(async (app: FastifyInstance) => {
    app.addHook("preHandler", async (request) => {
      const payload = request.user;

      // Check if `payload.kind` includes all required permissions
      const hasAllPermissions = requiredPermissions.every((permission) =>
        payload.sub.permissions.includes(permission)
      );

      if (!hasAllPermissions) {
        throw new ForbiddenError("Permissão insuficiente");
      }
    });
  });
