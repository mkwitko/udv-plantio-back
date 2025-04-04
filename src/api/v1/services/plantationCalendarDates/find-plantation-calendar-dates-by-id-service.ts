import { PlantationCalendarDatesModel } from "../../models/plantation-calendar-dates-model";

export async function findPlantationCalendarDatesByIdService({
  id,
}: {
  id: string;
}) {
  const plantationCalendarDatesModel = new PlantationCalendarDatesModel();
  const plantationCalendarDates = await plantationCalendarDatesModel.findById(
    id
  );
  return { plantationCalendarDates };
}
