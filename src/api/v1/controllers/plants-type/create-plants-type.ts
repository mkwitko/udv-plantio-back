import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createPlantsTypeService } from "../../services/plants-type/create-plants-type-service";

export const plantsTypeResponse = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export async function createPlantsType(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/plantsType/create",
    {
      schema: {
        tags: ["PlantsType"],
        summary: "Create PlantsType",
        description: "Create a new PlantsType",
        operationId: "createPlantsType",
        body: createPlantsTypeRequestScheam,
        response: {
          201: plantsTypeResponse,
        },
      },
    },
    async (request, response) => {
      const { plantsType } = await createPlantsTypeService(request.body);
      return response.status(201).send(plantsType);
    }
  );
}

export const createPlantsTypeRequestScheam = z.object({
  name: z.string(),
});
