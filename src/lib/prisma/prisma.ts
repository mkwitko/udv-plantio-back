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
          throw new Error(errorMessage);
        }
      },
    },
  },
});

export type ExtendedPrismaClient = typeof extendedPrismaClient;

export const prisma = extendedPrismaClient as ExtendedPrismaClient;
