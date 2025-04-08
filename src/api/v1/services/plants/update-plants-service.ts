import type z from "zod";
import { PlantsModel } from "../../models/plants-model";
import type { updatePlantRequestScheam } from "../../controllers/plants/update-plants";

export async function updatePlantsService(
  data: z.infer<typeof updatePlantRequestScheam>
) {
  const plantsModel = new PlantsModel();
  const plants = await plantsModel.update(data);
  return { plants };
}
