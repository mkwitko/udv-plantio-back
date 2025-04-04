import type z from "zod";
import { PlantsModel } from "../../models/plants-model";

export async function createPlantsService(
  data: z.infer<typeof createPlantsRequestScheam>
) {
  const plantsModel = new PlantsModel();
  const plants = await plantsModel.create({
    ...data,
  });
  return { plants };
}
