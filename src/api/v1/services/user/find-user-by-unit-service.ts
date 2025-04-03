import { UserModel } from "../../models/user-model";

export async function findUserByUnitService({ id }: { id: string }) {
  const userModel = new UserModel();
  const users = await userModel.findByUnit(id);
  return { users };
}
