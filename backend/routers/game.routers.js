import { Router } from "express";
import gameControllers from "../controllers/game.controllers.js";
import { saveGame, loadGame, deleteSavedGame } from "../controllers/gameState.controllers.js";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";

const router = Router();

/**
 * @swagger
 * /api/games/save:
 *   post:
 *     summary: Save current game state
 *     tags: [Games]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameId:
 *                 type: string
 *               name:
 *                 type: string
 *               data:
 *                 type: string
 *     responses:
 *       200:
 *         description: Game saved successfully
 */
router.post("/save", authenticateAccessToken, saveGame);

/**
 * @swagger
 * /api/games/load:
 *   get:
 *     summary: Load saved games
 *     tags: [Games]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of saved games
 */
router.get("/load", authenticateAccessToken, loadGame);

/**
 * @swagger
 * /api/games/save/{id}:
 *   delete:
 *     summary: Delete a saved game
 *     tags: [Games]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Saved game deleted
 */
router.delete("/save/:id", authenticateAccessToken, deleteSavedGame);

// Game Management Routes

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Retrieve a list of all games
 *     tags: [Games]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: A list of games.
 */
router.get("/", gameControllers.getAllGames);

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Get game details by ID
 *     tags: [Games]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game details
 */
router.get("/:id", gameControllers.getGameById);
// quyền admin, sau sẽ có authAdmin

/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Create a new game (Admin)
 *     tags: [Games]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Game created
 */
router.post("/", gameControllers.createGame);

/**
 * @swagger
 * /api/games/{id}:
 *   put:
 *     summary: Update a game (Admin)
 *     tags: [Games]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Game updated
 */
router.put("/:id", gameControllers.updateGame);

/**
 * @swagger
 * /api/games/{id}:
 *   delete:
 *     summary: Delete a game (Admin)
 *     tags: [Games]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game deleted
 */
router.delete("/:id", gameControllers.deleteGame);
export default router;