import { Router } from "express";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";
import gameSessionController from "../controllers/game_sessions.controller.js";
import { checkAndGrantAchievements } from "../controllers/achievements/achievement.logic.js";
const gameSessionRouter = Router();

gameSessionRouter.post(
  "/",
  authenticateAccessToken,
  gameSessionController.createGameSession,
  checkAndGrantAchievements
);

export default gameSessionRouter;
