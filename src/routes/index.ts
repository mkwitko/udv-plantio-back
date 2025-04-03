import { app } from "@/app";
import { userRoute } from "./user-route";
import { authenticationRoute } from "./authentication-route";
import { uploadRoute } from "./upload-route";

export default async function Routing() {
  authenticationRoute(app);
  userRoute(app);
  uploadRoute(app);
}
