import { createPlants } from "@/api/v1/controllers/plants/create-plants";
import { deletePlants } from "@/api/v1/controllers/plants/delete-plants";
import { findPlants } from "@/api/v1/controllers/plants/find-plants";
import { findPlantsById } from "@/api/v1/controllers/plants/find-plants-by-id";
import { updatePlant } from "@/api/v1/controllers/plants/update-plants";
import type { FastifyInstance } from "fastify";

export async function plantsRoute(app: FastifyInstance) {
  app.register(createPlants);
  app.register(deletePlants);
  app.register(findPlants);
  app.register(findPlantsById);
  app.register(updatePlant);
}
