import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { deletePlantationCalendarDatesService } from "../../services/plantationCalendarDates/delete-plantation-calendar-dates-service";

export async function deletePlantationCalendarDate(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .delete(
      "/plantationCalendarDate/delete",
      {
        schema: {
          tags: ["PlantationCalendarDate"],
          summary: "Delete PlantationCalendarDate",
          description: "Delete a PlantationCalendarDate",
          operationId: "deletePlantationCalendarDate",
          body: z.object({
            id: z.string().cuid(),
            soft: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              id: z.string().cuid(),
            }),
          },
        },
      },
      async (request, response) => {
        const { plantationCalendarDates } =
          await deletePlantationCalendarDatesService({
            userId: request.body.id,
            soft: request.body.soft,
          });
        return response.status(201).send({
          id: plantationCalendarDates.id,
        });
      }
    );
}
