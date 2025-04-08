import { prisma } from "prisma/db";
import type z from "zod";
import type { createPlantRequestSchema } from "../controllers/plants/create-plants";
import type { updatePlantRequestScheam } from "../controllers/plants/update-plants";

const include = {
  type: {
    select: {
      id: true,
      name: true,
    },
  },
  center: {
    select: {
      id: true,
      name: true,
      region: true,
    },
  },
};

export class PlantsModel {
  async create(data: z.infer<typeof createPlantRequestSchema>) {
    const plant = await prisma.plants.create({
      data,
      include,
    });
    return plant;
  }

  async findById(id: string) {
    const plant = await prisma.plants.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false,
      },
      include,
    });

    return plant;
  }

  async findByCenter(id: string) {
    const plants = await prisma.plants.findMany({
      where: {
        centerId: id,
        isDeleted: false,
      },
      include,
    });

    return plants;
  }

  async findAll() {
    const plants = await prisma.plants.findMany({
      where: {
        isDeleted: false,
      },
      include,
    });

    return plants;
  }

  async update(data: z.infer<typeof updatePlantRequestScheam>) {
    const plant = await prisma.plants.update({
      data,
      where: {
        id: data.id as string,
      },
      include,
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
        include,
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
