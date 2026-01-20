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
     * @swagger
     * /api/rankings/global/overall:
     *   get:
     *     summary: Get global overall ranking
     *     tags: [Rankings]
     *     security:
     *       - ApiKeyAuth: []
     *     responses:
     *       200:
     *         description: Global rankings
     */
    router.get("/global/overall", getRankingGlobalOverall);
    router.post("/global/overall", getRankingGlobalOverall);

    /**
     * @swagger
     * /api/rankings/global/{gameId}:
     *   get:
     *     summary: Get global ranking for specific game
     *     tags: [Rankings]
     *     security:
     *       - ApiKeyAuth: []
     *     parameters:
     *       - in: path
     *         name: gameId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Game rankings
     */
    router.get("/global/:gameId", getRankingGlobal);
    router.post("/global/:gameId", getRankingGlobal);

    // Protected routes (cần auth để biết userId)
    /**
     * @swagger
     * /api/rankings/friends/overall:
     *   get:
     *     summary: Get friends overall ranking
     *     tags: [Rankings]
     *     security:
     *       - cookieAuth: []
     *       - ApiKeyAuth: []
     *     responses:
     *       200:
     *         description: Friends ranking
     */
    router.get("/friends/overall", authenticateAccessToken, getRankingFriendsOverall);
    router.post("/friends/overall", authenticateAccessToken, getRankingFriendsOverall);

    /**
     * @swagger
     * /api/rankings/friends/{gameId}:
     *   get:
     *     summary: Get friends ranking for specific game
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
     *     responses:
     *       200:
     *         description: Friends game ranking
     */
    router.get("/friends/:gameId", authenticateAccessToken, getRankingFriendList);
    router.post("/friends/:gameId", authenticateAccessToken, getRankingFriendList);

    /**
     * @swagger
     * /api/rankings/personal/stats:
     *   get:
     *     summary: Get personal cumulative statistics
     *     tags: [Rankings]
     *     security:
     *       - cookieAuth: []
     *       - ApiKeyAuth: []
     *     responses:
     *       200:
     *         description: My stats
     */
    router.get("/personal/stats", authenticateAccessToken, getPersonalStatsOverall);

    /**
     * @swagger
     * /api/rankings/user/{gameId}:
     *   get:
     *     summary: Get user rank for a specific game
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
     *     responses:
     *       200:
     *         description: User rank
     */
    router.get("/user/:gameId", authenticateAccessToken, getRanking);

    app.use("/api/rankings", router)
}

export default rankingRouter

