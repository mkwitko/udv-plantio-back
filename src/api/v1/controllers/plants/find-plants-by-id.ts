import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { findPlantsByIdService } from "../../services/plants/find-plants-by-id-service";
import { plantResponse } from "./create-plants";

export async function findPlantsById(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/plants/find/id",
      {
        schema: {
          tags: ["Plants"],
          summary: "Find Plants by ID",
          description: "Find a Plants by ID",
          operationId: "findPlantsById",
          querystring: z.object({
            id: z.string().cuid(),
          }),
          response: {
            201: plantResponse,
          },
        },
      },
      async (request, response) => {
        const { plants } = await findPlantsByIdService(request.query);
        return response.status(201).send(plants);
      }
    );
}
