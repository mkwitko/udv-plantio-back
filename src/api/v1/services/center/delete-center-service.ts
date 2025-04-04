import { CenterModel } from "../../models/center-model";

export async function deleteCenterService({
  userId,
  soft,
}: {
  userId: string;
  soft?: boolean;
}) {
  const centerModel = new CenterModel();
  const center = await centerModel.exclude(userId, soft);
  return { center };
}
