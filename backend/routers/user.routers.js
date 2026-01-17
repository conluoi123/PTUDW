import { Router } from "express";
import { SignInWithGG, DirectGoogle, Register, Login, Logout, getProfile, updateProfile, refreshAccessToken, authMe, getTotalGame, getRanking } from "../controllers/user.controllers.js";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";
const userRouter = (app) => {
  const directRouter = Router();
  directRouter.get("/google", DirectGoogle);
  app.use("/api/user/login", directRouter);
  const callbackRouter = Router();
  callbackRouter.get("/google/callback", SignInWithGG);
  app.use("/api/user/login", callbackRouter);
  const router = Router();
  router.post("/refreshAccessToken", refreshAccessToken);
  router.get("/me", authenticateAccessToken, authMe);
  router.get("/rank", authenticateAccessToken, getRanking)
  router.get("/totalGame", authenticateAccessToken, getTotalGame);
  router.patch("/profile", authenticateAccessToken, updateProfile);
  router.get("/profile", authenticateAccessToken, getProfile);
  router.post("/logout", Logout);
  router.post("/login", Login);
  router.post("/register", Register);
  app.use("/api/user", router);
};

export { userRouter };