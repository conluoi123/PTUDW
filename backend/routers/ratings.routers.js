import { Router } from "express";
import { addRatings, deleteRating, getAllRatings, updateRating, getListRatings } from "../controllers/rating.controllers.js";

const ratingRouter = (app) => {
    const router = Router();
    // để cái lấy list này trên rating_id nhé :)) 
    router.get("/list_ratings", getListRatings); // lấy list đánh giá các game để hiển thị trang Home 
    router.delete("/:ratingId", deleteRating);
    router.put("/:ratingId", updateRating);
    router.post("/:gameId", addRatings);
    router.get("/:gameId", getAllRatings);

    app.use("/api/ratings", router);
}

export default ratingRouter;