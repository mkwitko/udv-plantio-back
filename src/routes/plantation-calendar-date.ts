import { createPlantationCalendarDate } from "@/api/v1/controllers/plantation-calendar-date/create-plantation-calendar-date";
import { deletePlantationCalendarDate } from "@/api/v1/controllers/plantation-calendar-date/delete-plantation-calendar-date";
import { findPlantationCalendarDatess } from "@/api/v1/controllers/plantation-calendar-date/find-plantation-calendar-date";
import { findPlantationCalendarDatesById } from "@/api/v1/controllers/plantation-calendar-date/find-plantation-calendar-date-by-id";
import { updatePlantationCalendarDates } from "@/api/v1/controllers/plantation-calendar-date/update-plantation-calendar-date";
import type { FastifyInstance } from "fastify";

export async function plantationCalendarDateRoute(app: FastifyInstance) {
  app.register(createPlantationCalendarDate);
  app.register(deletePlantationCalendarDate);
  app.register(findPlantationCalendarDatesById);
  app.register(findPlantationCalendarDatess);
  app.register(updatePlantationCalendarDates);
}
