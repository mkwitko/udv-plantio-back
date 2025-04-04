import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { plantationCalendarCategoryResponse } from "./create-plantation-calendar-category";
import { findPlantationCalendarCategoryService } from "../../services/plantationCalendarCategory/find-plantation-calendar-category-service";

export async function findPlantationCalendarCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/plantationCalendarCategory/find/all",
      {
        schema: {
          tags: ["PlantationCalendarCategory"],
          summary: "Find All PlantationCalendarCategory",
          description: "Find all PlantationCalendarCategory",
          operationId: "findAllPlantationCalendarCategory",
          response: {
            201: z.array(plantationCalendarCategoryResponse),
          },
        },
      },
      async (_, response) => {
        const { plantationCalendarCategory } =
          await findPlantationCalendarCategoryService();
        return response.status(201).send(plantationCalendarCategory);
      }
    );
}
