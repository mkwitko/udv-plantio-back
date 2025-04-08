import { createCenter } from "@/api/v1/controllers/center/create-center";
import { deleteCenter } from "@/api/v1/controllers/center/delete-center";
import { findCenters } from "@/api/v1/controllers/center/find-center";
import { findCenterById } from "@/api/v1/controllers/center/find-center-by-id";
import { updateCenter } from "@/api/v1/controllers/center/update-center";
import type { FastifyInstance } from "fastify";

export async function centerRoute(app: FastifyInstance) {
  app.register(createCenter);
  app.register(deleteCenter);
  app.register(findCenters);
  app.register(findCenterById);
  app.register(updateCenter);
}
