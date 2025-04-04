import { PlantsTypeModel } from "../../models/plants-type-model";

export async function findPlantsTypeService() {
  const plantsTypeModel = new PlantsTypeModel();
  const plantsType = await plantsTypeModel.findAll();
  return { plantsType };
}
