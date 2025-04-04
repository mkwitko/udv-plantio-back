import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { findUserByIdService } from "../../services/user/find-user-by-id-service";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { userResponse } from "./create-user";

export async function findUserById(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/user/find/id",
      {
        schema: {
          tags: ["User"],
          summary: "Find User by ID",
          description: "Find a user by ID",
          operationId: "findUserById",
          querystring: z.object({
            id: z.string().cuid(),
          }),
          response: {
            201: userResponse,
          },
        },
      },
      async (request, response) => {
        const { user } = await findUserByIdService(request.query);
        return response.status(201).send(user);
      }
    );
}
