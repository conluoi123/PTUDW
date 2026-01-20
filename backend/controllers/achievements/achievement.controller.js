
import express from "express";
import { authenticateAccessToken } from "../../middlewares/jwt.middlewares.js";
import { userMiddleware } from "../../middlewares/user.middlewares.js";
import { getUserId,load_achievements_me, load_achievements_id } from "./helper_function.js";
const router = express.Router();

// userId in body => get achievements of user
/**
 * @swagger
 * /achievements/me:
 *   get:
 *     summary: Get my achievements
 *     tags: [Achievements]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of achievements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Kiện tướng Caro"
 *                   game_id:
 *                     type: integer
 *                     example: 1
 *                   score:
 *                     type: integer
 *                     example: 100
 */
router.get(
  "/me",
  authenticateAccessToken,
  userMiddleware,
  getUserId,
  load_achievements_me,
  async (req, res) => {
    res.json(req.achievements);
  }
);

/**
 * @swagger
 * /achievements/{id}:
 *   get:
 *     summary: Get achievements of a user by ID
 *     tags: [Achievements]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of achievements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Kiện tướng Caro"
 *                   game_id:
 *                     type: integer
 *                     example: 1
 *                   score:
 *                     type: integer
 *                     example: 100
 */
router.get(
  "/:id",
  authenticateAccessToken,
  userMiddleware,
  load_achievements_id,
  async (req, res) => {
    res.json(req.achievements);
  }
);


export default function route_achievements(app) {
  app.use("/achievements",  router);
}
