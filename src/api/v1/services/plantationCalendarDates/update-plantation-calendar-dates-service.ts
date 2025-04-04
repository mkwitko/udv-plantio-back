import type z from "zod";
import { PlantationCalendarDatesModel } from "../../models/plantation-calendar-dates-model";

export async function updatePlantationCalendarDatesService(
  data: z.infer<typeof updatePlantationCalendarDatesRequestScheam>
) {
  const plantationCalendarDatesModel = new PlantationCalendarDatesModel();
  const plantationCalendarDates = await plantationCalendarDatesModel.update(
    data
  );
  return { plantationCalendarDates };
}
