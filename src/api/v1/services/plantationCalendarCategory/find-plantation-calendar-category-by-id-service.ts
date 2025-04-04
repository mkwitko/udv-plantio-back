import { PlantationCalendarCategoryModel } from "../../models/plantation-calendar-category-model";

export async function findPlantationCalendarCategoryByIdService({
  id,
}: {
  id: string;
}) {
  const plantationCalendarCategoryModel = new PlantationCalendarCategoryModel();
  const plantationCalendarCategory =
    await plantationCalendarCategoryModel.findById(id);
  return { plantationCalendarCategory };
}
