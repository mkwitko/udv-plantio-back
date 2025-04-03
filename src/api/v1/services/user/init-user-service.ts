import { hash } from "bcryptjs";
import { UserModel } from "../../models/user-model";
import { CompanyModel } from "../../models/company-model";

export async function initUserService() {
  const hashedPassword = await hash("86210262015", 8);
  const userModel = new UserModel();
  const companyModel = new CompanyModel();
  const company = await companyModel.create({
    name: "ProsperApps",
    cnpj: "12345678901234",
  });
  const user = await userModel.create({
    name: "SUPER ADMIN",
    cpf: "86210262015",
    birthday: "11/12/1995",
    password: hashedPassword,
    companies: [company.id],
    permissions: ["SUPERADMIN"],
  });
  return { user };
}
