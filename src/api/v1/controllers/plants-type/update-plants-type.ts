import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { plantsTypeResponse } from "./create-plants-type";
import { updatePlantsTypeService } from "../../services/plants-type/update-plants-type-service";

export async function updatePlantType(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .put(
      "/plantsType/update",
      {
        schema: {
          tags: ["PlantsType"],
          summary: "Update PlantsType",
          description: "Update a new PlantsType",
          operationId: "updatePlantsType",
          body: updatePlantTypeRequestScheam,
          response: {
            201: plantsTypeResponse,
          },
        },
      },
      async (request, response) => {
        const { plantsType } = await updatePlantsTypeService(request.body);
        return response.status(201).send(plantsType);
      }
    );
}

export const updatePlantTypeRequestScheam = z.object({
  id: z.string(),
  name: z.string(),
});
