import { Router } from "express";
import { addRatings, deleteRating, getAllRatings, updateRating, getListRatings } from "../controllers/rating.controllers.js";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";

const ratingRouter = (app) => {
    const router = Router();
    // để cái lấy list này trên rating_id nhé :)) 
    router.get("/list_ratings", getListRatings); // lấy list đánh giá các game để hiển thị trang Home
    router.post("/list_ratings", getListRatings); // lấy list đánh giá các game để hiển thị trang Home 
    router.delete("/:ratingId", authenticateAccessToken, deleteRating);
    router.put("/:ratingId", authenticateAccessToken, updateRating);
    router.post("/:gameId", authenticateAccessToken, addRatings);
    router.get("/:gameId", getAllRatings);

    app.use("/api/ratings", router);
}

export default ratingRouter;