import { app } from "@/app";
import { UnauthorizedError } from "@/errors/unauthorized-error";
import type { FastifyJWT } from "@fastify/jwt";
import { findUserByIdService } from "../user/find-user-by-id-service";
import type { User } from "@prisma/client";

export async function refreshTokenService(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  user: Omit<User, "password">;
}> {
  const decode = app.jwt.decode<FastifyJWT["payload"]>(refreshToken);

  if (!decode || !decode.userId) {
    throw new UnauthorizedError("Token inválido");
  }

  const { user } = await findUserByIdService({ id: decode.userId || "" });

  const accessToken = app.jwt.sign({
    userId: user.id,
  });

  const newRefreshToken = app.jwt.sign(
    {
      userId: user.id,
    },
    { expiresIn: "30d" }
  );

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user,
  };
}
