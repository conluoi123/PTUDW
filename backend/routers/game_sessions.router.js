import { Router } from "express";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";
import gameSessionController from "../controllers/game_sessions.controller.js";

const gameSessionRouter = Router();

gameSessionRouter.post(
  "/",
  authenticateAccessToken,
  gameSessionController.createGameSession
);

export default gameSessionRouter;
