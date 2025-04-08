import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { plantResponse } from "./create-plants";
import { findPlantsService } from "../../services/plants/find-plants-service";

export async function findPlants(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/plants/find/all",
      {
        schema: {
          tags: ["Plants"],
          summary: "Find All Plants",
          description: "Find all Plants",
          operationId: "findAllPlants",
          response: {
            201: z.array(plantResponse),
          },
        },
      },
      async (request, response) => {
        const { userId } = request.user;
        const { plants } = await findPlantsService(userId);
        return response.status(201).send(plants);
      }
    );
}
