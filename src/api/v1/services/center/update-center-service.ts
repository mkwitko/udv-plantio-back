import type z from "zod";
import { CenterModel } from "../../models/center-model";

export async function updateCenterService(
  data: z.infer<typeof updatecenterRequestScheam>
) {
  const centerModel = new CenterModel();
  const center = await centerModel.update(data);
  return { center };
}
