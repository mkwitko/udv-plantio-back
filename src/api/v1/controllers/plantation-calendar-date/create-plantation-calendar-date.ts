import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createPlantationCalendarDatesService } from "../../services/plantationCalendarDates/create-plantation-calendar-dates-service";

export const plantationCalendarDateResponse = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  date: z.date(),
  tooltip: z.string().optional().nullable(),
  plantationCalendarCategory: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  isDeleted: z.boolean(),
});

export async function createPlantationCalendarDate(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/plantationCalendarDate/create",
    {
      schema: {
        tags: ["PlantationCalendarDate"],
        summary: "Create PlantationCalendarDate",
        description: "Create a new PlantationCalendarDate",
        operationId: "createPlantationCalendarDate",
        body: createPlantationCalendarDateRequestScheam,
        response: {
          201: plantationCalendarDateResponse,
        },
      },
    },
    async (request, response) => {
      const { plantationCalendarDates } =
        await createPlantationCalendarDatesService(request.body);
      return response.status(201).send(plantationCalendarDates);
    }
  );
}

export const createPlantationCalendarDateRequestScheam = z.object({
  name: z.string(),
  type: z.string(),
  date: z.string(),
  tooltip: z.string().optional(),
  plantationCalendarCategory: z.string(),
});
