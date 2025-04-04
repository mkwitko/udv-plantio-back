import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { plantationCalendarCategoryResponse } from "./create-plantation-calendar-category";
import { findPlantationCalendarCategoryByIdService } from "../../services/plantationCalendarCategory/find-plantation-calendar-category-by-id-service";

export async function findPlantationCalendarCategoryById(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/plantationCalendarCategory/find/id",
      {
        schema: {
          tags: ["PlantationCalendarCategory"],
          summary: "Find PlantationCalendarCategory by ID",
          description: "Find a PlantationCalendarCategory by ID",
          operationId: "findPlantationCalendarCategoryById",
          querystring: z.object({
            id: z.string().cuid(),
          }),
          response: {
            201: plantationCalendarCategoryResponse,
          },
        },
      },
      async (request, response) => {
        const { plantationCalendarCategory } =
          await findPlantationCalendarCategoryByIdService(request.query);
        return response.status(201).send(plantationCalendarCategory);
      }
    );
}
