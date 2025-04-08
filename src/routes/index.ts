import { app } from "@/app";
import { userRoute } from "./user-route";
import { authenticationRoute } from "./authentication-route";
import { uploadRoute } from "./upload-route";
import { centerRoute } from "./center-router";
import { plantTypeRoute } from "./plant-type";
import { plantationCalendarDateRoute } from "./plantation-calendar-date";
import { plantsRoute } from "./plants";
import { faqRoute } from "./faq-router";
import { newsRoute } from "./news-route";

export default async function Routing() {
  authenticationRoute(app);
  userRoute(app);
  uploadRoute(app);
  centerRoute(app);
  plantTypeRoute(app);
  plantationCalendarDateRoute(app);
  plantsRoute(app);
  faqRoute(app);
  newsRoute(app);
}
