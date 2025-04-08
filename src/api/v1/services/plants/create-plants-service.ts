import type z from "zod";
import { PlantsModel } from "../../models/plants-model";
import type { createPlantRequestSchema } from "../../controllers/plants/create-plants";

export async function createPlantsService(
  data: z.infer<typeof createPlantRequestSchema>
) {
  const plantsModel = new PlantsModel();
  const plants = await plantsModel.create({
    ...data,
  });
  return { plants };
}
