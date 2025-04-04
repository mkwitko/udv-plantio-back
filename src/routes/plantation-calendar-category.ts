import { createPlantationCalendarCategory } from "@/api/v1/controllers/plantation-calendar-category/create-plantation-calendar-category";
import { deletePlantationCalendarCategory } from "@/api/v1/controllers/plantation-calendar-category/delete-plantation-calendar-category";
import { findPlantationCalendarCategory } from "@/api/v1/controllers/plantation-calendar-category/find-plantation-calendar-category";
import { findPlantationCalendarCategoryById } from "@/api/v1/controllers/plantation-calendar-category/find-plantation-calendar-category-by-id";
import { updatePlantationCalendarCategory } from "@/api/v1/controllers/plantation-calendar-category/update-plantation-calendar-category";
import type { FastifyInstance } from "fastify";

export async function plantationCalendarCategoryRoute(app: FastifyInstance) {
  app.register(createPlantationCalendarCategory);
  app.register(deletePlantationCalendarCategory);
  app.register(findPlantationCalendarCategory);
  app.register(findPlantationCalendarCategoryById);
  app.register(updatePlantationCalendarCategory);
}
