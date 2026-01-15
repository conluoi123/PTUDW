import Router from "express"
import { getRankingGlobal, getRanking, getRankingFriendList } from "../controllers/ranking.controllers.js";

const rankingRouter = (app) => {
    const router = Router();
    router.get("/global/:gameId", getRankingGlobal);
    router.get("/user/:gameId", getRanking);
    router.get("/friends/:gameId", getRankingFriendList);
    app.use("/api/rankings", router)
}

export default rankingRouter