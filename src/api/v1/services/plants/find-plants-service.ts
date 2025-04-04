import { PlantsModel } from "../../models/plants-model";

export async function findPlantsService() {
  const plantsModel = new PlantsModel();
  const plants = await plantsModel.findAll();
  return { plants };
}
