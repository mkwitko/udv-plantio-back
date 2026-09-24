import { ConflictError } from "@/errors/conflict-error";
import { NotFoundError } from "@/errors/not-found-error";
import { handlePrismaError } from "@/errors/prisma/prisma-error-handler";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

const extendedPrismaClient = prismaClient.$extends({
  query: {
    $allModels: {
      async $allOperations<Args, Result, Name extends string>({
        args,
        query,
      }: {
        args: Args;
        query: (args: Args) => Promise<Result>;
      }): Promise<Result> {
        try {
          return await query(args);
        } catch (error: any) {
          const errorMessage = handlePrismaError(error);
          // Registro inexistente (update/delete/findUniqueOrThrow): 404 para o
          // app distinguir de erro real.
          if (error?.code === "P2025") throw new NotFoundError(errorMessage);
          if (error?.code === "P2002") throw new ConflictError(errorMessage);
          throw new Error(errorMessage);
        }
      },
    },
  },
});

export type ExtendedPrismaClient = typeof extendedPrismaClient;

export const prisma = extendedPrismaClient as ExtendedPrismaClient;
