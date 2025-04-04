import type z from "zod";
import { PlantationCalendarCategoryModel } from "../../models/plantation-calendar-category-model";

export async function updatePlantationCalendarCategoryService(
  data: z.infer<typeof updatePlantationCalendarCategoryRequestScheam>
) {
  const plantationCalendarCategoryModel = new PlantationCalendarCategoryModel();
  const plantationCalendarCategory =
    await plantationCalendarCategoryModel.update(data);
  return { plantationCalendarCategory };
}
