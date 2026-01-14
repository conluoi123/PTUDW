import { Router } from "express";
import { SignInWithGG, DirectGoogle, Register, Login } from "../controllers/user.controllers.js";

const userRouter = (app) => {
  const directRouter = Router();
  directRouter.get("/google", DirectGoogle);
  app.use("/api/user/login", directRouter);
  const callbackRouter = Router();
  callbackRouter.get("/google/callback", SignInWithGG);
  app.use("/api/user/login", callbackRouter);
  const router = Router();
  router.post("/login", Login);
  router.post("/register", Register);
  app.use("/api/user", router);
};

export { userRouter };