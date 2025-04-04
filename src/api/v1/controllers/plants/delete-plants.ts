import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { deletePlantsService } from "../../services/plants/delete-plants-service";

export async function deletePlants(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .delete(
      "/plants/delete",
      {
        schema: {
          tags: ["Plants"],
          summary: "Delete Plants",
          description: "Delete a Plants",
          operationId: "deletePlants",
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
        const { plants } = await deletePlantsService({
          userId: request.body.id,
          soft: request.body.soft,
        });
        return response.status(201).send({
          id: plants.id,
        });
      }
    );
}
