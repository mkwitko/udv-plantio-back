import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { deleteCenterService } from "../../services/center/delete-center-service";

export async function deleteCenter(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .delete(
      "/center/delete",
      {
        schema: {
          tags: ["Center"],
          summary: "Delete Center",
          description: "Delete a Center",
          operationId: "deleteCenter",
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
        const { center } = await deleteCenterService({
          userId: request.body.id,
          soft: request.body.soft,
        });
        return response.status(201).send({
          id: center.id,
        });
      }
    );
}
