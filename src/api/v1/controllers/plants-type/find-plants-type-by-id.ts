import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { findPlantsTypeByIdService } from "../../services/plants-type/find-plants-type-by-id-service";
import { plantsTypeResponse } from "./create-plants-type";

export async function findPlantsTypeById(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/plantsType/find/id",
      {
        schema: {
          tags: ["PlantsType"],
          summary: "Find PlantsType by ID",
          description: "Find a PlantsType by ID",
          operationId: "findPlantsTypeById",
          querystring: z.object({
            id: z.string().cuid(),
          }),
          response: {
            201: plantsTypeResponse,
          },
        },
      },
      async (request, response) => {
        const { plantsType } = await findPlantsTypeByIdService(request.query);
        return response.status(201).send(plantsType);
      }
    );
}
