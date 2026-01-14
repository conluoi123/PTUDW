import { Router } from "express";
import { SignInWithGG, DirectGoogle } from "../controllers/user.controllers.js";

const userRouter = (app) => {
  const directRouter = Router();
  directRouter.get("/google", DirectGoogle);
  app.use("/api/user/login", directRouter);
  const callbackRouter = Router();
  callbackRouter.get("/google/callback", SignInWithGG);
  app.use("/api/user/login", callbackRouter);
};

export { userRouter };