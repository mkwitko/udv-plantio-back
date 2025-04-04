import { PlantsModel } from "../../models/plants-model";

export async function findPlantsByIdService({ id }: { id: string }) {
  const plantsModel = new PlantsModel();
  const plants = await plantsModel.findById(id);
  return { plants };
}
