import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { deletePlantationCalendarCategoryService } from "../../services/plantationCalendarCategory/delete-plantation-calendar-category-service";

export async function deletePlantationCalendarCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .delete(
      "/plantationCalendarCategory/delete",
      {
        schema: {
          tags: ["PlantationCalendarCategory"],
          summary: "Delete PlantationCalendarCategory",
          description: "Delete a PlantationCalendarCategory",
          operationId: "deletePlantationCalendarCategory",
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
        const { plantationCalendarCategory } =
          await deletePlantationCalendarCategoryService({
            userId: request.body.id,
            soft: request.body.soft,
          });
        return response.status(201).send({
          id: plantationCalendarCategory.id,
        });
      }
    );
}
