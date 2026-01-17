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
    router.get("/global/overall", getRankingGlobalOverall);
    router.get("/global/:gameId", getRankingGlobal);

    // Protected routes (cần auth để biết userId)
    router.get("/friends/overall", authenticateAccessToken, getRankingFriendsOverall);
    router.get("/friends/:gameId", getRankingFriendList);
    router.get("/personal/stats", getPersonalStatsOverall);
    router.get("/user/:gameId", getRanking);

    app.use("/api/rankings", router)
}

export default rankingRouter

