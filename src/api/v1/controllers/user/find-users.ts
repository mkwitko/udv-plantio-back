import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { findUsersService } from "../../services/user/find-users-service";

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
            201: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                cpf: z.string(),
                createdAt: z.date(),

                avatarUrl: z.string().nullable(),
                updatedAt: z.date(),
                deletedAt: z.date().nullable(),
                isDeleted: z.boolean(),
                birthday: z.string(),
                permissions: z.array(z.string()),
                companies: z.array(
                  z.object({ id: z.string(), name: z.string() })
                ),
                group: z.array(z.object({ id: z.string(), name: z.string() })),
                unit: z.array(z.object({ id: z.string(), name: z.string() })),
              })
            ),
          },
        },
      },
      async (_, response) => {
        const { users } = await findUsersService();
        return response.status(201).send(users);
      }
    );
}
