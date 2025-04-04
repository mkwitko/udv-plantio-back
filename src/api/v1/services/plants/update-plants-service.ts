import type z from "zod";
import { PlantsModel } from "../../models/plants-model";

export async function updatePlantsService(
  data: z.infer<typeof updateplantsRequestScheam>
) {
  const plantsModel = new PlantsModel();
  const plants = await plantsModel.update(data);
  return { plants };
}
