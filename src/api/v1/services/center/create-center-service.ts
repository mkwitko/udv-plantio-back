import type z from "zod";
import { CenterModel } from "../../models/center-model";

export async function createCenterService(
  data: z.infer<typeof createCenterRequestScheam>
) {
  const centerModel = new CenterModel();
  const center = await centerModel.create({
    ...data,
  });
  return { center };
}
