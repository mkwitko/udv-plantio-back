import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createUserService } from "../../services/user/create-user-service";

export const userResponse = z.object({
  id: z.string(),
  name: z.string(),
  cpf: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  isDeleted: z.boolean(),
  birthday: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  hierarchy: z.string().nullable(),
  isActive: z.boolean(),
  isVerified: z.boolean(),
  isAdmin: z.boolean(),
  isSuperAdmin: z.boolean(),
});

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/user/create",
    {
      schema: {
        tags: ["User"],
        summary: "Create User",
        description: "Create a new user",
        operationId: "createUser",
        body: createUserRequestScheam,
        response: {
          201: userResponse,
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
  cpf: z.string().optional(),
  password: z.string(),
  birthday: z.string().optional(),
  avatarUrl: z.string().optional(),
  email: z.string(),
  phone: z.string().optional(),
  hierarchy: z.string().optional(),
  isAdmin: z.boolean().optional(),
  isSuperAdmin: z.boolean().optional(),
});
