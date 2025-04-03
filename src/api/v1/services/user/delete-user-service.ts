import { UserModel } from '../../models/user-model'

export async function deleteUserService({
  userId,
  soft,
}: {
  userId: string
  soft?: boolean
}) {
  const userModel = new UserModel()
  const user = await userModel.exclude(userId, soft)
  return { user }
}
