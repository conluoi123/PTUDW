import { Router } from "express";
import { getAllRatings } from "../controllers/rating.controllers.js";

const ratingRouter = (app) => {
    const router = Router();
    router.get("/:gameId", getAllRatings);
    app.use("/api/ratings", router);
}

export default ratingRouter;