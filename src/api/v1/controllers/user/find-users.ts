import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { findUsersService } from "../../services/user/find-users-service";
import { userResponse } from "./create-user";

export async function findUsers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/user/find/all",
      {
        schema: {
          tags: ["User"],
          summary: "Find All Users",
          description: "Find all Users",
          operationId: "findAllUsers",
          response: {
            201: z.array(userResponse),
          },
        },
      },
      async (_, response) => {
        const { users } = await findUsersService();
        return response.status(201).send(users);
      }
    );
}
