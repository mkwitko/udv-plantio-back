import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createPlantationCalendarCategoryService } from "../../services/plantationCalendarCategory/create-plantation-calendar-category-service";

export const plantationCalendarCategoryResponse = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  tooltip: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  isDeleted: z.boolean(),
});

export async function createPlantationCalendarCategory(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/plantationCalendarCategory/create",
    {
      schema: {
        tags: ["PlantationCalendarCategory"],
        summary: "Create PlantationCalendarCategory",
        description: "Create a new PlantationCalendarCategory",
        operationId: "createPlantationCalendarCategory",
        body: createPlantationCalendarCategoryRequestScheam,
        response: {
          201: plantationCalendarCategoryResponse,
        },
      },
    },
    async (request, response) => {
      const { plantationCalendarCategory } =
        await createPlantationCalendarCategoryService(request.body);
      return response.status(201).send(plantationCalendarCategory);
    }
  );
}

export const createPlantationCalendarCategoryRequestScheam = z.object({
  name: z.string(),
  label: z.string(),
  tooltip: z.string().optional(),
});
