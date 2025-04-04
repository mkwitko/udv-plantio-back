import { PlantsTypeModel } from "../../models/plants-type-model";

export async function deletePlantsTypeService({
  userId,
  soft,
}: {
  userId: string;
  soft?: boolean;
}) {
  const plantsTypeModel = new PlantsTypeModel();
  const plantsType = await plantsTypeModel.exclude(userId, soft);
  return { plantsType };
}
