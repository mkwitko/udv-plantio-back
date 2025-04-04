import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createPlantsService } from "../../services/plants/create-plants-service";

export const plantResponse = z.object({
  id: z.string(),
  name: z.string(),
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
        body: createPlantRequestScheam,
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

export const createPlantRequestScheam = z.object({
  name: z.string(),
});
