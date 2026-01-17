import Router from "express"
import {
    getRankingGlobal,
    getRanking,
    getRankingFriendList,
    getRankingGlobalOverall,
    getRankingFriendsOverall,
    getPersonalStatsOverall
} from "../controllers/ranking.controllers.js";

const rankingRouter = (app) => {
    const router = Router();

    // đặt này trước để khỏi dính lỗi id 
    router.get("/global/overall", getRankingGlobalOverall);
    router.get("/friends/overall", getRankingFriendsOverall);
    router.get("/personal/stats", getPersonalStatsOverall);

    // Game-specific rankings
    router.get("/global/:gameId", getRankingGlobal);
    router.get("/user/:gameId", getRanking);
    router.get("/friends/:gameId", getRankingFriendList);

    app.use("/api/rankings", router)
}

export default rankingRouter
