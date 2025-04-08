import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { plantationCalendarDateResponse } from "./create-plantation-calendar-date";
import { updatePlantationCalendarDatesService } from "../../services/plantationCalendarDates/update-plantation-calendar-dates-service";

export async function updatePlantationCalendarDates(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .put(
      "/plantationCalendarDates/update",
      {
        schema: {
          tags: ["PlantationCalendarDate"],
          summary: "Update PlantationCalendarDates",
          description: "Update a new PlantationCalendarDates",
          operationId: "updatePlantationCalendarDates",
          body: updatePlantationCalendarDatesRequestScheam,
          response: {
            201: plantationCalendarDateResponse,
          },
        },
      },
      async (request, response) => {
        const { plantationCalendarDates } =
          await updatePlantationCalendarDatesService(request.body);
        return response.status(201).send(plantationCalendarDates);
      }
    );
}

export const updatePlantationCalendarDatesRequestScheam = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  date: z.string(),
  tooltip: z.string().optional(),
  plantationCalendarCategory: z.string(),
});
