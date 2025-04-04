import { PlantationCalendarDatesModel } from "../../models/plantation-calendar-dates-model";

export async function deletePlantationCalendarDatesService({
  userId,
  soft,
}: {
  userId: string;
  soft?: boolean;
}) {
  const plantationCalendarDatesModel = new PlantationCalendarDatesModel();
  const plantationCalendarDates = await plantationCalendarDatesModel.exclude(
    userId,
    soft
  );
  return { plantationCalendarDates };
}
