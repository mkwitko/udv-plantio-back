import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { findUserByGroupService } from "../../services/user/find-user-by-group-service";

export async function findUserByGroup(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/user/find/group",
      {
        schema: {
          tags: ["User"],
          summary: "Find User by Group",
          description: "Find a user by Group",
          operationId: "findUserByGroup",
          querystring: z.object({
            id: z.string().cuid(),
          }),
          response: {
            201: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                cpf: z.string(),

                avatarUrl: z.string().nullable(),
                createdAt: z.date(),
                updatedAt: z.date(),
                deletedAt: z.date().nullable(),
                isDeleted: z.boolean(),
                birthday: z.string(),
                permissions: z.array(z.string()),
                companies: z.array(
                  z.object({ id: z.string(), name: z.string() })
                ),
                group: z.array(z.object({ id: z.string(), name: z.string() })),
              })
            ),
          },
        },
      },
      async (request, response) => {
        const { users } = await findUserByGroupService(request.query);
        return response.status(201).send(users);
      }
    );
}
