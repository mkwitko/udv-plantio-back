import { PlantationCalendarDatesModel } from "../../models/plantation-calendar-dates-model";

export async function findPlantationCalendarDatesService() {
  const plantationCalendarDatesModel = new PlantationCalendarDatesModel();
  const plantationCalendarDates = await plantationCalendarDatesModel.findAll();
  return { plantationCalendarDates };
}
