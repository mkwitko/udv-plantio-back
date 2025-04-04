import { PlantationCalendarCategoryModel } from "../../models/plantation-calendar-category-model";

export async function deletePlantationCalendarCategoryService({
  userId,
  soft,
}: {
  userId: string;
  soft?: boolean;
}) {
  const plantationCalendarCategoryModel = new PlantationCalendarCategoryModel();
  const plantationCalendarCategory =
    await plantationCalendarCategoryModel.exclude(userId, soft);
  return { plantationCalendarCategory };
}
