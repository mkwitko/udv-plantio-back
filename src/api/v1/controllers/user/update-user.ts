import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { updateUserService } from "../../services/user/update-user-service";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";

export async function updateUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .put(
      "/user/update",
      {
        schema: {
          tags: ["User"],
          summary: "Update User",
          description: "Update a new user",
          operationId: "updateUser",
          body: updateUserRequestScheam,
          response: {
            201: z.object({
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
            }),
          },
        },
      },
      async (request, response) => {
        const { user } = await updateUserService(request.body);
        return response.status(201).send(user);
      }
    );
}

export const updateUserRequestScheam = z.object({
  id: z.string(),
  name: z.string().optional(),
  cpf: z.string().optional(),
  companies: z.array(z.string().nullable()).optional(), // Optional field
  group: z.array(z.string().nullable()).optional(), // Optional field
  unit: z.array(z.string().nullable()).optional(), // Optional field
  permissions: z.array(z.string()), // Optional field
  avatarUrl: z.string().optional(),
});
