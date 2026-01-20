import Router from "express"
import {
    getRankingGlobal,
    getRanking,
    getRankingFriendList,
    getRankingGlobalOverall,
    getRankingFriendsOverall,
    getPersonalStatsOverall
} from "../controllers/ranking.controllers.js";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";

const rankingRouter = (app) => {
    const router = Router();

    // Public routes (không cần auth)
    /**
/**
 * @swagger
 * /api/rankings/global/overall:
 *   get:
 *     summary: Get overall global rankings
 *     tags: [Rankings]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Global rankings list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rank:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: "top_player"
 *                   score:
 *                     type: integer
 *                     example: 5000
 */
router.get("/global/overall", getRankingGlobalOverall);
router.post("/global/overall", getRankingGlobalOverall);

/**
 * @swagger
 * /api/rankings/global/{gameId}:
 *   get:
 *     summary: Get global rankings for a specific game
 *     tags: [Rankings]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         example: "tictactoe"
 *     responses:
 *       200:
 *         description: Game-specific global rankings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rank:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: "tictactoe_master"
 *                   score:
 *                     type: integer
 *                     example: 500
 */
router.get("/global/:gameId", getRankingGlobal);
router.post("/global/:gameId", getRankingGlobal);

/**
 * @swagger
 * /api/rankings/friends/overall:
 *   get:
 *     summary: Get overall rankings among friends
 *     tags: [Rankings]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Friends rankings list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rank:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: "friend_1"
 *                   score:
 *                     type: integer
 *                     example: 2000
 */
router.get("/friends/overall", authenticateAccessToken, getRankingFriendsOverall);
router.post("/friends/overall", authenticateAccessToken, getRankingFriendsOverall);

/**
 * @swagger
 * /api/rankings/friends/{gameId}:
 *   get:
 *     summary: Get friend rankings for a specific game
 *     tags: [Rankings]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         example: "tictactoe"
 *     responses:
 *       200:
 *         description: Game-specific friend rankings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   rank:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: "friend_2"
 *                   score:
 *                     type: integer
 *                     example: 100
 */
router.get("/friends/:gameId", authenticateAccessToken, getRankingFriendList);
router.post("/friends/:gameId", authenticateAccessToken, getRankingFriendList);

/**
 * @swagger
 * /api/rankings/personal/stats:
 *   get:
 *     summary: Get personal statistics
 *     tags: [Rankings]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalGames:
 *                   type: integer
 *                   example: 50
 *                 wins:
 *                   type: integer
 *                   example: 25
 *                 winRate:
 *                   type: number
 *                   example: 50.0
 */
router.get("/personal/stats", authenticateAccessToken, getPersonalStatsOverall);

/**
 * @swagger
 * /api/rankings/user/{gameId}:
 *   get:
 *     summary: Get user ranking for a specific game
 *     tags: [Rankings]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         example: "tictactoe"
 *     responses:
 *       200:
 *         description: User game ranking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rank:
 *                   type: integer
 *                   example: 10
 *                 score:
 *                   type: integer
 *                   example: 120
 */
router.get("/user/:gameId", authenticateAccessToken, getRanking);

    app.use("/api/rankings", router)
}

export default rankingRouter
