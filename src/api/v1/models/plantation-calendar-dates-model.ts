import { prisma } from "prisma/db";
import type z from "zod";
import type { createPlantationCalendarDateRequestScheam } from "../controllers/plantation-calendar-date/create-plantation-calendar-date";
import type { updatePlantationCalendarDatesRequestScheam } from "../controllers/plantation-calendar-date/update-plantation-calendar-date";

export class PlantationCalendarDatesModel {
  async create(
    data: z.infer<typeof createPlantationCalendarDateRequestScheam>
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
      });

    return plantationCalendarDate;
  }

  async findAll() {
    const plantationCalendarDates =
      await prisma.plantationCalendarDates.findMany({
        where: {
          isDeleted: false,
        },
      });

    return plantationCalendarDates;
  }

  async update(
    data: z.infer<typeof updatePlantationCalendarDatesRequestScheam>
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
