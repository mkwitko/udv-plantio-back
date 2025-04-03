import { UserModel } from "../../models/user-model";

export async function findUserByCompanyService({ id }: { id: string }) {
  const userModel = new UserModel();
  const users = await userModel.findByCompany(id);
  return { users };
}
