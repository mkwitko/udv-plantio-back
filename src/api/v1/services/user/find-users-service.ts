import { UserModel } from "../../models/user-model";

export async function findUsersService() {
  const userModel = new UserModel();
  const users = await userModel.findAll();
  return { users };
}
