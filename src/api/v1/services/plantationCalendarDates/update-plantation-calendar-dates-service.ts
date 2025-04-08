import type z from "zod";
import { PlantationCalendarDatesModel } from "../../models/plantation-calendar-dates-model";
import type { updatePlantationCalendarDatesRequestScheam } from "../../controllers/plantation-calendar-date/update-plantation-calendar-date";

export async function updatePlantationCalendarDatesService(
  data: z.infer<typeof updatePlantationCalendarDatesRequestScheam>
) {
  const plantationCalendarDatesModel = new PlantationCalendarDatesModel();
  const plantationCalendarDates = await plantationCalendarDatesModel.update(
    data
  );
  return { plantationCalendarDates };
}
