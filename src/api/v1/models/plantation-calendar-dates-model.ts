import { prisma } from "prisma/db";
import type z from "zod";

export class PlantationCalendarDatesModel {
  async create(
    data: z.infer<typeof createPlantationCalendarDatesRequestSchema>
  ) {
    const plantationCalendarDate = await prisma.plantationCalendarDates.create({
      data,
    });
    return plantationCalendarDate;
  }

  async findById(id: string) {
    const plantationCalendarDate =
      await prisma.plantationCalendarDates.findUniqueOrThrow({
        where: {
          id,
          isDeleted: false,
        },
        include: {
          plantationCalendarCategory: true,
        },
      });

    return plantationCalendarDate;
  }

  async findAll() {
    const plantationCalendarDates =
      await prisma.plantationCalendarDates.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          plantationCalendarCategory: true,
        },
      });

    return plantationCalendarDates;
  }

  async update(
    data: z.infer<typeof updatePlantationCalendarDatesRequestSchema>
  ) {
    const plantationCalendarDate = await prisma.plantationCalendarDates.update({
      data,
      where: {
        id: data.id as string,
      },
    });
    return plantationCalendarDate;
  }

  async exclude(id: string, soft = false) {
    if (soft) {
      const plantationCalendarDate =
        await prisma.plantationCalendarDates.update({
          data: {
            deletedAt: new Date(),
            isDeleted: true,
          },
          where: {
            id,
          },
        });
      return plantationCalendarDate;
    }

    const plantationCalendarDate = await prisma.plantationCalendarDates.delete({
      where: {
        id,
      },
    });
    return plantationCalendarDate;
  }
}
