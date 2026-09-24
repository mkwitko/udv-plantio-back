import { app } from "@/app";
import { UnauthorizedError } from "@/errors/unauthorized-error";
import type { FastifyJWT } from "@fastify/jwt";
import { isTokenType } from "@/lib/token-type";
import { findUserByIdService } from "../user/find-user-by-id-service";

export async function refreshTokenService(refreshToken: string) {
  // verify (não decode): o token do body precisa ter assinatura válida,
  // senão qualquer um forjaria um userId e receberia tokens de outra conta.
  const decode = await app.jwt.verify<FastifyJWT["payload"]>(refreshToken);

  if (!decode || !decode.userId || !isTokenType(decode, "refresh")) {
    throw new UnauthorizedError("Token inválido");
  }

  const { user } = await findUserByIdService({ id: decode.userId || "" });

  const accessToken = app.jwt.sign({
    userId: user.id,
    typ: "access",
  });

  const newRefreshToken = app.jwt.sign(
    {
      userId: user.id,
      typ: "refresh",
    },
    { expiresIn: "30d" }
  );

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user,
  };
}
