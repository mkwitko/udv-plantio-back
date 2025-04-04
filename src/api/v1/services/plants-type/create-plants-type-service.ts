import type z from "zod";
import { PlantsTypeModel } from "../../models/plants-type-model";

export async function createPlantsTypeService(
  data: z.infer<typeof createPlantsTypeRequestScheam>
) {
  const plantsTypeModel = new PlantsTypeModel();
  const plantsType = await plantsTypeModel.create({
    ...data,
  });
  return { plantsType };
}
