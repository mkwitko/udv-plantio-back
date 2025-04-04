import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { updateUserService } from "../../services/user/update-user-service";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { userResponse } from "./create-user";

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
            201: userResponse,
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
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
  birthday: z.string().optional(),
  avatarUrl: z.string().optional(),
  email: z.string(),
  phone: z.string().optional(),
  hierarchy: z.string().optional(),
  isAdmin: z.boolean().optional(),
  isSuperAdmin: z.boolean().optional(),
});
