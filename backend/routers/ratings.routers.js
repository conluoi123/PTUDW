import { Router } from "express";
import { addRatings, deleteRating, getAllRatings, updateRating } from "../controllers/rating.controllers.js";

const ratingRouter = (app) => {
    const router = Router();
    router.delete("/:ratingId", deleteRating);
    router.put("/:ratingId", updateRating);
    router.post("/:gameId", addRatings);
    router.get("/:gameId", getAllRatings);
    app.use("/api/ratings", router);
}

export default ratingRouter;