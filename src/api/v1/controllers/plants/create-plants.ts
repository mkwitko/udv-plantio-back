import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createPlantsService } from "../../services/plants/create-plants-service";

export const plantResponse = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  observation: z.string().nullable(),

  image: z.string().nullable(),
  origin: z.string().nullable(),
  identificationNumber: z.string().nullable(),
  isIdentified: z.boolean().nullable(),

  plantationDate: z.date().nullable(),
  pictureDate: z.date().nullable(),

  lastWatering: z.date().nullable(),
  lastFertilization: z.date().nullable(),
  lastPestControl: z.date().nullable(),
  lastPruning: z.date().nullable(),
  lastHarvest: z.date().nullable(),
  lastWeeding: z.date().nullable(),
  lastSoilAnalysis: z.date().nullable(),

  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  address: z.string().nullable(),

  type: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
  center: z
    .object({
      id: z.string(),
      name: z.string(),
      region: z.string(),
    })
    .nullable(),
  typeId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export async function createPlants(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/plants/create",
    {
      schema: {
        tags: ["Plants"],
        summary: "Create Plants",
        description: "Create a new Plants",
        operationId: "createPlants",
        body: createPlantRequestSchema,
        response: {
          201: plantResponse,
        },
      },
    },
    async (request, response) => {
      const { plants } = await createPlantsService(request.body);
      return response.status(201).send(plants);
    }
  );
}

export const createPlantRequestSchema = z.object({
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
