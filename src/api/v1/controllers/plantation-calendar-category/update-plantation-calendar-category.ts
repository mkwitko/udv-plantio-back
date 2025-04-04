import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { plantationCalendarCategoryResponse } from "./create-plantation-calendar-category";
import { updatePlantationCalendarCategoryService } from "../../services/plantationCalendarCategory/update-plantation-calendar-category-service";

export async function updatePlantationCalendarCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .put(
      "/plantationCalendarCategory/update",
      {
        schema: {
          tags: ["PlantationCalendarCategory"],
          summary: "Update PlantationCalendarCategory",
          description: "Update a new PlantationCalendarCategory",
          operationId: "updatePlantationCalendarCategory",
          body: updatePlantationCalendarCategoryRequestScheam,
          response: {
            201: plantationCalendarCategoryResponse,
          },
        },
      },
      async (request, response) => {
        const { plantationCalendarCategory } =
          await updatePlantationCalendarCategoryService(request.body);
        return response.status(201).send(plantationCalendarCategory);
      }
    );
}

export const updatePlantationCalendarCategoryRequestScheam = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  date: z.string(),
  tooltip: z.string().optional(),
  plantationCalendarCategoryId: z.string(),
});
