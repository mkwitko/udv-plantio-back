import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { initUserService } from "../../services/user/init-user-service";

export async function initUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/user/init",
    {
      schema: {
        tags: ["User"],
        summary: "Init User",
        description: "Init a new user",
        operationId: "InitUser",
        response: {
          201: z.object({
            id: z.string(),
            name: z.string(),
            cpf: z.string(),
          }),
        },
      },
    },
    async (_, response) => {
      const { user } = await initUserService();
      return response.status(201).send(user);
    }
  );
}
