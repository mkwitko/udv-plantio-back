import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { plantationCalendarDateResponse } from "./create-plantation-calendar-date";
import { findPlantationCalendarDatesService } from "../../services/plantationCalendarDates/find-plantation-calendar-dates-service";

export async function findPlantationCalendarDatess(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/plantationCalendarDates/find/all",
      {
        schema: {
          tags: ["PlantationCalendarDate"],
          summary: "Find All PlantationCalendarDatess",
          description: "Find all PlantationCalendarDatess",
          operationId: "findAllPlantationCalendarDatess",
          response: {
            201: z.array(plantationCalendarDateResponse),
          },
        },
      },
      async (_, response) => {
        const { plantationCalendarDates } =
          await findPlantationCalendarDatesService();
        return response.status(201).send(plantationCalendarDates);
      }
    );
}
