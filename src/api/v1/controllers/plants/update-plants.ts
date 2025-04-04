import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { plantResponse } from "./create-plants";
import { updatePlantsService } from "../../services/plants/update-plants-service";

export async function updatePlant(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .put(
      "/plant/update",
      {
        schema: {
          tags: ["Plant"],
          summary: "Update Plant",
          description: "Update a new Plant",
          operationId: "updatePlant",
          body: updatePlantRequestScheam,
          response: {
            201: plantResponse,
          },
        },
      },
      async (request, response) => {
        const { plants } = await updatePlantsService(request.body);
        return response.status(201).send(plants);
      }
    );
}

export const updatePlantRequestScheam = z.object({
  id: z.string(),
  name: z.string(),
  typeId: z.string(),
});
