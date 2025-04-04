import { PlantationCalendarCategoryModel } from "../../models/plantation-calendar-category-model";

export async function findPlantationCalendarCategoryService() {
  const plantationCalendarCategoryModel = new PlantationCalendarCategoryModel();
  const plantationCalendarCategory =
    await plantationCalendarCategoryModel.findAll();
  return { plantationCalendarCategory };
}
