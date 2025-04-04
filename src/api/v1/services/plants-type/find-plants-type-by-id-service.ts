import { PlantsTypeModel } from "../../models/plants-type-model";

export async function findPlantsTypeByIdService({ id }: { id: string }) {
  const plantsTypeModel = new PlantsTypeModel();
  const plantsType = await plantsTypeModel.findById(id);
  return { plantsType };
}
