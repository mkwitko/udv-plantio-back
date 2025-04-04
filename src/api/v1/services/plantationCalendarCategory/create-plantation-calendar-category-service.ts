import type z from "zod";
import { PlantationCalendarCategoryModel } from "../../models/plantation-calendar-category-model";

export async function createPlantationCalendarCategoryService(
  data: z.infer<typeof createPlantationCalendarCategoryRequestScheam>
) {
  const plantationCalendarCategoryModel = new PlantationCalendarCategoryModel();
  const plantationCalendarCategory =
    await plantationCalendarCategoryModel.create({
      ...data,
    });
  return { plantationCalendarCategory };
}
