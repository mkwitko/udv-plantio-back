import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { authenticationMiddleware } from "@/middlewares/authentication-middleware";
import { centerResponse } from "./create-center";
import { updateCenterService } from "../../services/center/update-center-service";

export async function updateCenter(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authenticationMiddleware)
    .put(
      "/center/update",
      {
        schema: {
          tags: ["Center"],
          summary: "Update Center",
          description: "Update a new Center",
          operationId: "updateCenter",
          body: updateCenterRequestScheam,
          response: {
            201: centerResponse,
          },
        },
      },
      async (request, response) => {
        const { center } = await updateCenterService(request.body);
        return response.status(201).send(center);
      }
    );
}

export const updateCenterRequestScheam = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),
});
