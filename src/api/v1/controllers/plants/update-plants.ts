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
  description: z.string().optional(),
  observation: z.string().optional(),

  image: z.string().optional(),
  origin: z.string().optional(),
  identificationNumber: z.string().optional(),
  isIdentified: z.boolean().optional(),

  plantationDate: z.date().optional(),
  pictureDate: z.date().optional(),

  lastWatering: z.date().optional(),
  lastFertilization: z.date().optional(),
  lastPestControl: z.date().optional(),
  lastPruning: z.date().optional(),
  lastHarvest: z.date().optional(),
  lastWeeding: z.date().optional(),
  lastSoilAnalysis: z.date().optional(),

  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),

  typeId: z.string().nullable(),
  centerId: z.string().nullable(),
});
