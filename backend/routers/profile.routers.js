import { Router } from "express";
import {
  signatureCloudinary,
  saveAvatar,
} from "../controllers/profile.controllers.js";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";
const profileRouter = (app) => {
  const router = Router();
  router.post("/saveAvatar", authenticateAccessToken, saveAvatar);
  router.get("/signature", authenticateAccessToken, signatureCloudinary);
  app.use("/api/user/profile", router);
};

export { profileRouter };
