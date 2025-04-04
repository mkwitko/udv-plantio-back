import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { centerResponse } from "./create-center";
import { findCenterService } from "../../services/center/find-center-service";

export async function findCenters(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/center/find/all",
      {
        schema: {
          tags: ["Center"],
          summary: "Find All Centers",
          description: "Find all Centers",
          operationId: "findAllCenters",
          response: {
            201: z.array(centerResponse),
          },
        },
      },
      async (_, response) => {
        const { center } = await findCenterService();
        return response.status(201).send(center);
      }
    );
}
