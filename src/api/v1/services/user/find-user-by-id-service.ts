import { UserModel } from "../../models/user-model";

export async function findUserByIdService({ id }: { id: string }) {
  const userModel = new UserModel();
  const user = await userModel.findById(id);
  return { user };
}
