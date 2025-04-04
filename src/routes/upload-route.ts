import { getPressignedUrl } from "@/api/v1/controllers/upload/upload";
import type { FastifyInstance } from "fastify";

export async function uploadRoute(app: FastifyInstance) {
  app.register(getPressignedUrl);
}
