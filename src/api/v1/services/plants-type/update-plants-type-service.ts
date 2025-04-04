import type z from "zod";
import { PlantsTypeModel } from "../../models/plants-type-model";

export async function updatePlantsTypeService(
  data: z.infer<typeof updateplantsTypeRequestScheam>
) {
  const plantsTypeModel = new PlantsTypeModel();
  const plantsType = await plantsTypeModel.update(data);
  return { plantsType };
}
