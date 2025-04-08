import type z from "zod";
import { PlantationCalendarDatesModel } from "../../models/plantation-calendar-dates-model";
import type { createPlantationCalendarDateRequestScheam } from "../../controllers/plantation-calendar-date/create-plantation-calendar-date";

export async function createPlantationCalendarDatesService(
  data: z.infer<typeof createPlantationCalendarDateRequestScheam>
) {
  const plantationCalendarDatesModel = new PlantationCalendarDatesModel();
  const plantationCalendarDates = await plantationCalendarDatesModel.create({
    ...data,
  });
  return { plantationCalendarDates };
}
