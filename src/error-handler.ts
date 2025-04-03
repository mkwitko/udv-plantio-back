// import { isAxiosError } from 'axios'
import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { BadRequestError } from "./errors/bad-request-error";
import { ConflictError } from "./errors/conflict-error";
import { ForbiddenError } from "./errors/forbidden-error";
import { PrismaError } from "./errors/prisma-error";
import { UnauthorizedError } from "./errors/unauthorized-error";
import { clearAuth } from "./api/v1/services/authentication/clear-auth-service";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Erro de validação",
      errors: error.flatten().fieldErrors,
    });
  }

  // if (isAxiosError(error)) {
  //   return reply.status(error.response?.status || 500).send({
  //     message: error.message || 'External service error',
  //   })
  // }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    });
  }

  if (error instanceof ForbiddenError) {
    return reply.status(403).send({
      message: error.message,
    });
  }

  if (error instanceof ConflictError) {
    return reply.status(409).send({
      message: error.message,
    });
  }

  if (error instanceof UnauthorizedError) {
    clearAuth(reply);
    return reply.status(401).send({
      message: error.message,
    });
  }

  if (error instanceof PrismaError) {
    if (
      error.message ===
        "Operação falhou porque registros dependentes não foram encontrados: Expected a record, found none." ||
      request.url === "/user/find/me"
    ) {
      clearAuth(reply);
    }
    return reply.status(409).send({
      message: error.message,
    });
  }

  // Send error to some observability service

  return reply.status(500).send({
    message: "Internal server error",
  });
};
