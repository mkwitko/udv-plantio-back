import { hash } from "bcryptjs";
import { UserModel } from "../../models/user-model";
import type z from "zod";
import type { createUserRequestScheam } from "../../controllers/user/create-user";

export async function createUserService(
  data: z.infer<typeof createUserRequestScheam>
) {
  const hashedPassword = await hash(data.password, 10);
  const userModel = new UserModel();
  const user = await userModel.create({
    ...data,
    password: hashedPassword,
  });
  return { user };
}
