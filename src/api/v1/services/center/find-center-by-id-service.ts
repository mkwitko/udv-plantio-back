import { CenterModel } from "../../models/center-model";

export async function findCenterByIdService({ id }: { id: string }) {
  const centerModel = new CenterModel();
  const center = await centerModel.findById(id);
  return { center };
}
