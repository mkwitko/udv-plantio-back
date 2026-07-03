import { findCenters } from "@/api/v1/controllers/center/find-center";
import { findCenterById } from "@/api/v1/controllers/center/find-center-by-id";
import type { FastifyInstance } from "fastify";

export async function centerRoute(app: FastifyInstance) {
  app.register(findCenters);
  app.register(findCenterById);
}
