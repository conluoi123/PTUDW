
import express from "express";
import { insert_user_achieve } from "./helper_function.js";
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
// achivements is array in body
router.post(
  "/me",
  authenticateAccessToken,
  userMiddleware,
  getUserId,
  async (req, res) => {
    try {
      // TODO: cập nhật lại việc lấy id từ userId cho request
      const achievements = req.body.achievements;
      const id_user = req.userId;
      if (!Array.isArray(achievements)) {
        return res
          .status(400)
          .json({ message: "Achievements must be an array" });
      }
      if (achievements.length === 0) {
        return res
          .status(400)
          .json({ message: "Achievements array cannot be empty" });
      }

      achievements.forEach(async (achievement_id) => {
        await insert_user_achieve(id_user, achievement_id);
      });
      return res
        .status(200)
        .json({ message: "Achievements created successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);


export default function route_achievements(app) {
  app.use("/achievements",  router);
}
