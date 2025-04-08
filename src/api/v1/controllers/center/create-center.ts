import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { createCenterService } from "../../services/center/create-center-service";

export const centerResponse = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  isDeleted: z.boolean(),
});

export async function createCenter(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/center/create",
    {
      schema: {
        tags: ["Center"],
        summary: "Create Center",
        description: "Create a new Center",
        operationId: "createCenter",
        body: createCenterRequestScheam,
        response: {
          201: centerResponse,
        },
      },
    },
    async (request, response) => {
      const { center } = await createCenterService(request.body);
      return response.status(201).send(center);
    }
  );
}

export const createCenterRequestScheam = z.object({
  name: z.string(),
  region: z.string(),
});
