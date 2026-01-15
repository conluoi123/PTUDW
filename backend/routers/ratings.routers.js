import { Router } from "express";
import { addRatings, getAllRatings } from "../controllers/rating.controllers.js";

const ratingRouter = (app) => {
    const router = Router();
    router.post("/:gameId", addRatings);
    router.get("/:gameId", getAllRatings);
    app.use("/api/ratings", router);
}

export default ratingRouter;