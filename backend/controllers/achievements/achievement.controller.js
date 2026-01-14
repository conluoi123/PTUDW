import db from "../../configs/db.js";
import express from "express";
import { insert_user_achieve } from "./helper_function.js";
const router = express.Router();
// userId in body => get achievements of user
router.get("/me", getUserId, load_achievements_me, async (req, res) => {
  res.json(req.achievements);
});
router.get("/:id", load_achievements_id, async (req, res) => {
  res.json(req.achievements);
});
// achivements is array in body
router.post("/me", getUserId, async (req, res) => {
  try {
    // TODO: cập nhật lại việc lấy id từ userId cho request
    const achievements = req.body.achievements;
    const id_user = req.userId;
    if(!Array.isArray(achievements)) {
      return res.status(400).json({ message: "Achievements must be an array" });
    }
    if(achievements.length === 0) {
      return res.status(400).json({ message: "Achievements array cannot be empty" });
    }

    achievements.forEach(async (achievement) => {
      await insert_user_achieve(id_user, achievement);
    });
    return res.status(200).json({ message: "Achievements created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

async function load_achievements_me(req, res, next) {
  try {
    const id_user =  req.userId;
    const user_achivement = await db("achievements as a")
      .join("user_achievements as ua", "a.id", "ua.achievement_id")
      .where("ua.user_id", id_user)
      .select("a.*");
    if (user_achivement.length === 0) {
      return res.status(404).json({ message: "User achievements not found" });
    }
    req.achievements = user_achivement;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function load_achievements_id(req, res, next) {
  try {
    const id_achievement = req.params.id;
    const achievement = await db("achievements")
      .where("id", id_achievement)
      .select("*");
    if (achievement.length === 0) {
      return res.status(404).json({ message: "Achievement not found" });
    }
    req.achievements = achievement;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
// TODO: hardcode userId, sẽ lấy từ token sau
function getUserId(req, res, next) {
  req.userId = req.userId || "58446a41-0366-4322-87eb-ea6a3c34bc8e" ;
  next();
}




export default function route_achievements(app) {
  app.use("/achievements", router);
}
