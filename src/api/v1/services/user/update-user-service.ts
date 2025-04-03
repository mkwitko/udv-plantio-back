import { UserModel } from "@/api/v1/models/user-model";
import type z from "zod";
import type { updateUserRequestScheam } from "../../controllers/user/update-user";

export async function updateUserService(
  data: z.infer<typeof updateUserRequestScheam>
) {
  const userModel = new UserModel();
  const user = await userModel.update(data);
  return { user };
}
