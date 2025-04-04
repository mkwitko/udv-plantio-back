import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { deletePlantsTypeService } from "../../services/plants-type/delete-plants-type-service";

export async function deletePlantsType(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .delete(
      "/plantsType/delete",
      {
        schema: {
          tags: ["PlantsType"],
          summary: "Delete PlantsType",
          description: "Delete a PlantsType",
          operationId: "deletePlantsType",
          body: z.object({
            id: z.string().cuid(),
            soft: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              id: z.string().cuid(),
            }),
          },
        },
      },
      async (request, response) => {
        const { plantsType } = await deletePlantsTypeService({
          userId: request.body.id,
          soft: request.body.soft,
        });
        return response.status(201).send({
          id: plantsType.id,
        });
      }
    );
}
