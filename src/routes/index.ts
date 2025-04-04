import { app } from "@/app";
import { userRoute } from "./user-route";
import { authenticationRoute } from "./authentication-route";
import { uploadRoute } from "./upload-route";
import { centerRoute } from "./center";
import { plantTypeRoute } from "./plant-type";
import { plantationCalendarCategoryRoute } from "./plantation-calendar-category";
import { plantationCalendarDateRoute } from "./plantation-calendar-date";
import { plantsRoute } from "./plants";

export default async function Routing() {
  authenticationRoute(app);
  userRoute(app);
  uploadRoute(app);
  centerRoute(app);
  plantTypeRoute(app);
  plantationCalendarCategoryRoute(app);
  plantationCalendarDateRoute(app);
  plantsRoute(app);
}
