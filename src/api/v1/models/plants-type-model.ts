import { prisma } from "prisma/db";
import type z from "zod";

export class PlantsTypeModel {
  async create(data: z.infer<typeof createPlantsTypeRequestSchema>) {
    const plantsType = await prisma.plantsType.create({
      data,
    });
    return plantsType;
  }

  async findById(id: string) {
    const plantsType = await prisma.plantsType.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false,
      },
    });

    return plantsType;
  }

  async findAll() {
    const plantsTypes = await prisma.plantsType.findMany({
      where: {
        isDeleted: false,
      },
    });

    return plantsTypes;
  }

  async update(data: z.infer<typeof updatePlantsTypeRequestSchema>) {
    const plantsType = await prisma.plantsType.update({
      data,
      where: {
        id: data.id as string,
      },
    });
    return plantsType;
  }

  async exclude(id: string, soft = false) {
    if (soft) {
      const plantsType = await prisma.plantsType.update({
        data: {
          deletedAt: new Date(),
          isDeleted: true,
        },
        where: {
          id,
        },
      });
      return plantsType;
    }

    const plantsType = await prisma.plantsType.delete({
      where: {
        id,
      },
    });
    return plantsType;
  }
}
