import { prisma } from "prisma/db";
import type z from "zod";

export class PlantationCalendarCategoryModel {
  async create(
    data: z.infer<typeof createPlantationCalendarCategoryRequestSchema>
  ) {
    const plantationCalendarCategory =
      await prisma.plantationCalendarCategory.create({
        data,
      });
    return plantationCalendarCategory;
  }

  async findById(id: string) {
    const plantationCalendarCategory =
      await prisma.plantationCalendarCategory.findUniqueOrThrow({
        where: {
          id,
          isDeleted: false,
        },
        include: {
          plantationCalendarDates: true,
        },
      });

    return plantationCalendarCategory;
  }

  async findAll() {
    const plantationCalendarCategories =
      await prisma.plantationCalendarCategory.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          plantationCalendarDates: true,
        },
      });

    return plantationCalendarCategories;
  }

  async update(
    data: z.infer<typeof updatePlantationCalendarCategoryRequestSchema>
  ) {
    const plantationCalendarCategory =
      await prisma.plantationCalendarCategory.update({
        data,
        where: {
          id: data.id as string,
        },
      });
    return plantationCalendarCategory;
  }

  async exclude(id: string, soft = false) {
    if (soft) {
      const plantationCalendarCategory =
        await prisma.plantationCalendarCategory.update({
          data: {
            deletedAt: new Date(),
            isDeleted: true,
          },
          where: {
            id,
          },
        });
      return plantationCalendarCategory;
    }

    const plantationCalendarCategory =
      await prisma.plantationCalendarCategory.delete({
        where: {
          id,
        },
      });
    return plantationCalendarCategory;
  }
}
