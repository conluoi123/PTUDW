import { Router } from "express";
import { addRatings, deleteRating, getAllRatings, updateRating, getListRatings } from "../controllers/rating.controllers.js";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";

const ratingRouter = (app) => {
    const router = Router();
    // để cái lấy list này trên rating_id nhé :)) 
    /**
     * @swagger
     * /api/ratings/list_ratings:
     *   get:
     *     summary: Get ratings list for Home Page
     *     tags: [Ratings]
     *     security:
     *       - ApiKeyAuth: []
     *     responses:
     *       200:
     *         description: Ratings list
     */
    router.get("/list_ratings", getListRatings); // lấy list đánh giá các game để hiển thị trang Home
    router.post("/list_ratings", getListRatings); // lấy list đánh giá các game để hiển thị trang Home 
    
    /**
     * @swagger
     * /api/ratings/{ratingId}:
     *   delete:
     *     summary: Delete a rating
     *     tags: [Ratings]
     *     security:
     *       - cookieAuth: []
     *       - ApiKeyAuth: []
     *     parameters:
     *       - in: path
     *         name: ratingId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Rating deleted
     */
    router.delete("/:ratingId", authenticateAccessToken, deleteRating);

    /**
     * @swagger
     * /api/ratings/{ratingId}:
     *   put:
     *     summary: Update a rating
     *     tags: [Ratings]
     *     security:
     *       - cookieAuth: []
     *       - ApiKeyAuth: []
     *     parameters:
     *       - in: path
     *         name: ratingId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *     responses:
     *       200:
     *         description: Rating updated
     */
    router.put("/:ratingId", authenticateAccessToken, updateRating);

    /**
     * @swagger
     * /api/ratings/{gameId}:
     *   post:
     *     summary: Add a rating for a game
     *     tags: [Ratings]
     *     security:
     *       - cookieAuth: []
     *       - ApiKeyAuth: []
     *     parameters:
     *       - in: path
     *         name: gameId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *     responses:
     *       200:
     *         description: Rating added
     */
    router.post("/:gameId", authenticateAccessToken, addRatings);

    /**
     * @swagger
     * /api/ratings/{gameId}:
     *   get:
     *     summary: Get all ratings for a game
     *     tags: [Ratings]
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
     *         description: Game ratings
     */
    router.get("/:gameId", getAllRatings);

    app.use("/api/ratings", router);
}

export default ratingRouter;