import { createUser } from "@/api/v1/controllers/user/create-user";
import { deleteUser } from "@/api/v1/controllers/user/delete-user";
import { findMe } from "@/api/v1/controllers/user/find-me";
import { findUserByCompany } from "@/api/v1/controllers/user/find-user-by-company";
import { findUserByGroup } from "@/api/v1/controllers/user/find-user-by-group";
import { findUserById } from "@/api/v1/controllers/user/find-user-by-id";
import { findUserByUnit } from "@/api/v1/controllers/user/find-user-by-unit";
import { findUsers } from "@/api/v1/controllers/user/find-users";
import { initUser } from "@/api/v1/controllers/user/init-user";
import { updateUser } from "@/api/v1/controllers/user/update-user";
import type { FastifyInstance } from "fastify";

export async function userRoute(app: FastifyInstance) {
  app.register(createUser);
  app.register(deleteUser);
  app.register(findUsers);
  app.register(findUserByCompany);
  app.register(findUserByGroup);
  app.register(findUserByUnit);
  app.register(findUserById);
  app.register(updateUser);
  app.register(findMe);

  // Apenas ativar para criar o primeiro usuário com a empresa da Prosperapps atrelado
  app.register(initUser);
}
