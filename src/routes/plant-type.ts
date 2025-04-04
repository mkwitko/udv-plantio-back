import { createPlantsType } from "@/api/v1/controllers/plants-type/create-plants-type";
import { deletePlantsType } from "@/api/v1/controllers/plants-type/delete-plants-type";
import { findPlantsType } from "@/api/v1/controllers/plants-type/find-plants-type";
import { findPlantsTypeById } from "@/api/v1/controllers/plants-type/find-plants-type-by-id";
import { updatePlantType } from "@/api/v1/controllers/plants-type/update-plants-type";
import type { FastifyInstance } from "fastify";

export async function plantTypeRoute(app: FastifyInstance) {
  app.register(createPlantsType);
  app.register(deletePlantsType);
  app.register(findPlantsType);
  app.register(findPlantsTypeById);
  app.register(updatePlantType);
}
