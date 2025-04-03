import { UserModel } from "../../models/user-model";

export async function findUserByGroupService({ id }: { id: string }) {
  const userModel = new UserModel();
  const users = await userModel.findByGroup(id);
  return { users };
}
