import { hash } from "bcryptjs";
import { UserModel } from "../../models/user-model";

export async function initUserService() {
  const hashedPassword = await hash("xhu7voh8", 10);
  const userModel = new UserModel();

  const user = await userModel.create({
    name: "Maurício de Oliveira Kwitko",
    cpf: "86210262015",
    password: hashedPassword,
    birthday: "11/12/1995",
    email: "mauriciokwt@gmail.com",
    phone: "+5551994682002",
    hierarchy: "CI",
    isAdmin: true,
    isSuperAdmin: true,
  });
  return { user };
}
