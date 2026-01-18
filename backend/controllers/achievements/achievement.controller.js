
import express from "express";
import { authenticateAccessToken } from "../../middlewares/jwt.middlewares.js";
import { userMiddleware } from "../../middlewares/user.middlewares.js";
import { getUserId,load_achievements_me, load_achievements_id } from "./helper_function.js";
const router = express.Router();
// userId in body => get achievements of user
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
