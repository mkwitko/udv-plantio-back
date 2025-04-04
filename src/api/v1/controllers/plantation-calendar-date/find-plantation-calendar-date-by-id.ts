import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { plantationCalendarDateResponse } from "./create-plantation-calendar-date";
import { findPlantationCalendarDatesByIdService } from "../../services/plantationCalendarDates/find-plantation-calendar-dates-by-id-service";

export async function findPlantationCalendarDatesById(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/plantationCalendarDates/find/id",
      {
        schema: {
          tags: ["PlantationCalendarDate"],
          summary: "Find PlantationCalendarDates by ID",
          description: "Find a PlantationCalendarDates by ID",
          operationId: "findPlantationCalendarDatesById",
          querystring: z.object({
            id: z.string().cuid(),
          }),
          response: {
            201: plantationCalendarDateResponse,
          },
        },
      },
      async (request, response) => {
        const { plantationCalendarDates } =
          await findPlantationCalendarDatesByIdService(request.query);
        return response.status(201).send(plantationCalendarDates);
      }
    );
}
