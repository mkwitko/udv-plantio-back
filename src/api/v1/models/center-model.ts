import { prisma } from "prisma/db";
import type z from "zod";
import type { createCenterRequestScheam } from "../controllers/center/create-center";
import type { updateCenterRequestScheam } from "../controllers/center/update-center";

export class CenterModel {
  async create(data: z.infer<typeof createCenterRequestScheam>) {
    const center = await prisma.center.create({
      data,
    });
    return center;
  }

  async findById(id: string) {
    const center = await prisma.center.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false,
      },
    });

    return center;
  }

  async findAll() {
    const centers = await prisma.center.findMany({
      where: {
        isDeleted: false,
      },
    });

    return centers;
  }

  async update(data: z.infer<typeof updateCenterRequestScheam>) {
    const center = await prisma.center.update({
      data,
      where: {
        id: data.id as string,
      },
    });
    return center;
  }

  async exclude(id: string, soft = false) {
    if (soft) {
      const center = await prisma.center.update({
        data: {
          deletedAt: new Date(),
          isDeleted: true,
        },
        where: {
          id,
        },
      });
      return center;
    }

    const center = await prisma.center.delete({
      where: {
        id,
      },
    });
    return center;
  }
}
