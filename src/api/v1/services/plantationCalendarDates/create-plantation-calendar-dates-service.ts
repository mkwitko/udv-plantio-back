import type z from "zod";
import { PlantationCalendarDatesModel } from "../../models/plantation-calendar-dates-model";

export async function createPlantationCalendarDatesService(
  data: z.infer<typeof createPlantationCalendarDatesRequestScheam>
) {
  const plantationCalendarDatesModel = new PlantationCalendarDatesModel();
  const plantationCalendarDates = await plantationCalendarDatesModel.create({
    ...data,
  });
  return { plantationCalendarDates };
}
