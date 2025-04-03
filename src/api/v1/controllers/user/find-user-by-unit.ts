import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { findUserByUnitService } from "../../services/user/find-user-by-unit-service";

export async function findUserByUnit(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/user/find/unit",
      {
        schema: {
          tags: ["User"],
          summary: "Find User by Unit",
          description: "Find a user by Unit",
          operationId: "findUserByUnit",
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
                unit: z.array(z.object({ id: z.string(), name: z.string() })),
              })
            ),
          },
        },
      },
      async (request, response) => {
        const { users } = await findUserByUnitService(request.query);
        return response.status(201).send(users);
      }
    );
}
