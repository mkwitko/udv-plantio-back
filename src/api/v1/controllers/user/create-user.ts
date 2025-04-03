import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createUserService } from "../../services/user/create-user-service";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";

export async function createUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .post(
      "/user/create",
      {
        schema: {
          tags: ["User"],
          summary: "Create User",
          description: "Create a new user",
          operationId: "createUser",
          body: createUserRequestScheam,
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
        const { user } = await createUserService(request.body);
        return response.status(201).send(user);
      }
    );
}

export const createUserRequestScheam = z.object({
  name: z.string(),
  birthday: z.string(),
  avatarUrl: z.string().optional(),
  permissions: z.array(z.string()),
  cpf: z.string(),
  companies: z.array(z.string()),
  group: z.array(z.string().nullable()).optional(), // Optional field
  unit: z.array(z.string().nullable()).optional(), // Optional field
});
