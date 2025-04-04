import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { centerResponse } from "./create-center";
import { findCenterByIdService } from "../../services/center/find-center-by-id-service";

export async function findCenterById(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .get(
      "/center/find/id",
      {
        schema: {
          tags: ["Center"],
          summary: "Find Center by ID",
          description: "Find a Center by ID",
          operationId: "findCenterById",
          querystring: z.object({
            id: z.string().cuid(),
          }),
          response: {
            201: centerResponse,
          },
        },
      },
      async (request, response) => {
        const { center } = await findCenterByIdService(request.query);
        return response.status(201).send(center);
      }
    );
}
