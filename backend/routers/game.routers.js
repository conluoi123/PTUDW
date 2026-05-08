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
 *                 example: "tictactoe"
 *               name:
 *                 type: string
 *                 example: "My Save 1"
 *               data:
 *                 type: string
 *                 example: "{\"board\":[[null,null],[null,\"X\"]],\"turn\":\"O\"}"
 *     responses:
 *       200:
 *         description: Game saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Game saved successfully"
 *                 saveId:
 *                   type: string
 *                   example: "60d0fe4f5311236168a109ca"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "60d0fe4f5311236168a109ca"
 *                   name:
 *                     type: string
 *                     example: "My Save 1"
 *                   gameId:
 *                     type: string
 *                     example: "tictactoe"
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-20T12:00:00Z"
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
 *         example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       200:
 *         description: Saved game deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Save deleted"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   name:
 *                     type: string
 *                     example: "Tic Tac Toe"
 *                   description:
 *                     type: string
 *                     example: "Classic X/O game"
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
 *         example: "1"
 *     responses:
 *       200:
 *         description: Game details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "1"
 *                 name:
 *                   type: string
 *                   example: "Tic Tac Toe"
 *                 instructions:
 *                    type: string
 *                    example: "Connect 3 to win"
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Game"
 *               description: 
 *                  type: string
 *                  example: "Description"
 *     responses:
 *       201:
 *         description: Game created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Game created successfully"
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
 *         example: "1"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Game updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Game updated"
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
 *         example: "1"
 *     responses:
 *       200:
 *         description: Game deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Game deleted"
 */
router.delete("/:id", gameControllers.deleteGame);
export default router;