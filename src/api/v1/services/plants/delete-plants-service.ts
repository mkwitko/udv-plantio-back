import { PlantsModel } from "../../models/plants-model";

export async function deletePlantsService({
  userId,
  soft,
}: {
  userId: string;
  soft?: boolean;
}) {
  const plantsModel = new PlantsModel();
  const plants = await plantsModel.exclude(userId, soft);
  return { plants };
}
