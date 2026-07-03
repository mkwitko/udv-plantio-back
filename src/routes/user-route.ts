import { findMe } from "@/api/v1/controllers/user/find-me";
import { findUserById } from "@/api/v1/controllers/user/find-user-by-id";
import { findUsers } from "@/api/v1/controllers/user/find-users";
import type { FastifyInstance } from "fastify";

export async function userRoute(app: FastifyInstance) {
  app.register(findUsers);
  app.register(findUserById);
  app.register(findMe);
}
