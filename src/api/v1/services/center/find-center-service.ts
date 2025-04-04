import { CenterModel } from "../../models/center-model";

export async function findCenterService() {
  const centerModel = new CenterModel();
  const center = await centerModel.findAll();
  return { center };
}
