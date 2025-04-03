import { PrismaError } from "@/errors/prisma-error";
import { handlePrismaError } from "@/errors/prisma/prisma-error-handler";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({});

// Middleware para capturar erros
prisma.$use(async (params: any, next: any) => {
  try {
    return await next(params);
  } catch (e) {
    throw new PrismaError(handlePrismaError(e));
  }
});
