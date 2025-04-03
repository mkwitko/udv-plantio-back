import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { findUserByIdService } from "../../services/user/find-user-by-id-service";
import { unitItem } from "@/@types/zod/unit/unit";
import { groupItem } from "@/@types/zod/group/group";
import { companyItem } from "@/@types/zod/companies/companies";
import { userItem } from "@/@types/zod/user/user";
import { clearAuth } from "../../services/authentication/clear-auth-service";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";

export async function findMe(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/user/find/me",
      {
        schema: {
          tags: ["User"],
          summary: "Find Me",
          description: "Find Me",
          operationId: "findMe",
          response: {
            201: z.object({
              ...userItem.shape,
              companies: z.array(companyItem),
              group: z.array(groupItem),
              unit: z.array(unitItem),
            }),
            409: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, response) => {
        const id = request.user.sub.id;
        const { user } = await findUserByIdService({ id });

        if (response.statusCode === 409) {
          clearAuth(response);
        }

        return response
          .status(201)
          .send(user)
          .status(409)
          .send({ message: "Desconectando usuário" });
      }
    );
}
