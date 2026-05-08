import { Router } from "express";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";
import gameSessionController from "../controllers/game_sessions.controller.js";
import { checkAndGrantAchievements } from "../controllers/achievements/achievement.logic.js";
const gameSessionRouter = Router();

/**
 * @swagger
 * /api/game-sessions:
 *   post:
 *     summary: Create a new game session (and check achievements)
 *     tags: [Game Sessions]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameId:
 *                 type: string
 *                 example: "tictactoe"
 *               score:
 *                 type: integer
 *                 example: 100
 *               result:
 *                 type: string
 *                 example: "win"
 *               duration:
 *                 type: integer
 *                 example: 120
 *     responses:
 *       200:
 *         description: Game session created
 */
gameSessionRouter.post(
  "/",
  authenticateAccessToken,
  gameSessionController.createGameSession,
  checkAndGrantAchievements
);

export default gameSessionRouter;
