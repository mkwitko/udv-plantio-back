import { prisma } from "prisma/db";
import type z from "zod";

export class PlantsModel {
  async create(data: z.infer<typeof createPlantsRequestSchema>) {
    const plant = await prisma.plants.create({
      data,
    });
    return plant;
  }

  async findById(id: string) {
    const plant = await prisma.plants.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false,
      },
    });

    return plant;
  }

  async findAll() {
    const plants = await prisma.plants.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        type: true,
      },
    });

    return plants;
  }

  async update(data: z.infer<typeof updatePlantsRequestSchema>) {
    const plant = await prisma.plants.update({
      data,
      where: {
        id: data.id as string,
      },
    });
    return plant;
  }

  async exclude(id: string, soft = false) {
    if (soft) {
      const plant = await prisma.plants.update({
        data: {
          deletedAt: new Date(),
          isDeleted: true,
        },
        where: {
          id,
        },
      });
      return plant;
    }

    const plant = await prisma.plants.delete({
      where: {
        id,
      },
    });
    return plant;
  }
}
