import { PlantsModel } from "../../models/plants-model";
import { UserModel } from "../../models/user-model";

export async function findPlantsService(userId: string) {
  const userModel = new UserModel();
  const plantsModel = new PlantsModel();

  const user = await userModel.findById(userId);

  if (user.isAdmin || user.isSuperAdmin) {
    const plants = await plantsModel.findAll();
    return { plants };
  }

  if (user.centerId) {
    const plants = await plantsModel.findByCenter(user.centerId);
    return { plants };
  }

  return { plants: [] };
}
