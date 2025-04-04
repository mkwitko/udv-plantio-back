import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { plantsTypeResponse } from "./create-plants-type";
import { findPlantsTypeService } from "../../services/plants-type/find-plants-type-service";

export async function findPlantsType(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/plantsType/find/all",
      {
        schema: {
          tags: ["PlantsType"],
          summary: "Find All PlantsTypes",
          description: "Find all PlantsTypes",
          operationId: "findAllPlantsTypes",
          response: {
            201: z.array(plantsTypeResponse),
          },
        },
      },
      async (_, response) => {
        const { plantsType } = await findPlantsTypeService();
        return response.status(201).send(plantsType);
      }
    );
}
