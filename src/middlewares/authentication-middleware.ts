import { refreshTokenService } from "@/api/v1/services/authentication/refresh-token-service";
import { setHttpOnlyCookie } from "@/api/v1/services/authentication/set-http-only-cookie";
import { UnauthorizedError } from "@/errors/unauthorized-error";
import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { TokenExpiredError } from "jsonwebtoken";

export const authenticationMiddleware = fastifyPlugin(
  async (app: FastifyInstance) => {
    app.addHook("preHandler", async (request, reply) => {
      try {
        // Extract the access token from cookies
        const accessToken = request.cookies.accessToken;
        const refreshToken = request.cookies.refreshToken;

        // If there's no access token, throw an UnauthorizedError
        if (!accessToken) {
          if (!refreshToken)
            throw new UnauthorizedError("Token de acesso não fornecido");

          throw new TokenExpiredError(
            "Token de acesso não fornecido",
            new Date()
          );
        }

        // Verify the JWT token
        request.user = await app.jwt.verify(accessToken);
      } catch (error) {
        // If the token is expired, try to refresh it
        if (error instanceof TokenExpiredError) {
          // Extract the refresh token from cookies
          const refreshToken = request.cookies.refreshToken;

          if (!refreshToken) {
            throw new UnauthorizedError("Token de acesso expirado");
          }

          try {
            // Verify the refresh token
            await app.jwt.verify(refreshToken);

            // Issue a new access token
            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = await refreshTokenService(refreshToken);

            setHttpOnlyCookie(reply, newAccessToken, newRefreshToken);

            // Assign the user to the request object
            request.user = await app.jwt.verify(newAccessToken);
          } catch (refreshError) {
            throw new UnauthorizedError("Token de atualização não fornecido");
          }
        } else {
          // Handle other JWT verification errors
          throw new UnauthorizedError();
        }
      }
    });
  }
);
