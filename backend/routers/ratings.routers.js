import { Router } from "express";
// import { addRatings, deleteRating, getAllRatings, updateRating, getListRatings } from "../controllers/rating.controllers.js";
import * as ratingController from "../controllers/rating.controllers.js";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";

const ratingRouter = (app) => {
    const router = Router();
    // để cái lấy list này trên rating_id nhé :)) 
    /**
 * @swagger
 * /api/ratings/list_ratings:
 *   get:
 *     summary: Get all ratings
 *     tags: [Ratings]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "rating_1"
 *                   gameId:
 *                     type: string
 *                     example: "tictactoe"
 *                   rating:
 *                     type: integer
 *                     example: 5
 *                   comment:
 *                     type: string
 *                     example: "Great game!"
 */
router.get("/list_ratings", ratingController.getListRatings);
router.post("/list_ratings", ratingController.getListRatings);

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
 *         example: "rating_1"
 *     responses:
 *       200:
 *         description: Rating deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rating deleted"
 */
router.delete("/:ratingId", authenticateAccessToken, ratingController.deleteRating);

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
 *         example: "rating_1"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Updated review"
 *     responses:
 *       200:
 *         description: Rating updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rating updated"
 */
router.put("/:ratingId", authenticateAccessToken, ratingController.updateRating);

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
 *         example: "tictactoe"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Awesome!"
 *     responses:
 *       201:
 *         description: Rating added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rating added"
 */
router.post("/:gameId", authenticateAccessToken, ratingController.addRatings);

/**
 * @swagger
 * /api/ratings/{gameId}:
 *   get:
 *     summary: Get rating for a specific game
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
 *         example: "tictactoe"
 *     responses:
 *       200:
 *         description: Game rating details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageRating:
 *                   type: number
 *                   example: 4.5
 *                 totalRatings:
 *                   type: integer
 *                   example: 100
 */
router.get("/:gameId", ratingController.getAllRatings);

    app.use("/api/ratings", router);
}

export default ratingRouter;