import db from "../configs/db.js";
import express from "express";

const router = express.Router();
// TODO: tìm cách lấy id từ userId cho request
router.get("/me",load_achievements, async (req, res) => {
  res.json(req.achievements);
  console.log(req.achievements);
});
router.get("/:id",load_achievements, async (req, res) => {
  res.json(req.achievements);
  console.log(req.achievements);
});
// TODO: tìm cách lấy id từ userId cho request
router.post("/me", async (req, res) => {
  try {
    // TODO: cập nhật lại việc lấy id từ userId cho request
    const achievements = req.body.achievements;
    const user_achivement = await db("achievements").insert(achievements).returning("*");
    if(!user_achivement){
        return res.status(404).json({ message: "Achievement not found" });
    }
    return res.status(200).json(user_achivement);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

async function load_achievements(req, res, next) {
    try {
    const id_user = req.params.id || req.userId;
    console.log(id_user);
    const user_achivement = await db("achievements").where({id:id_user});
    if(!user_achivement){
        return res.status(404).json({ message: "User achievements not found" });
    }
    req.achievements = user_achivement;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



export default function route_achievements(app) {
  app.use("/achievements", router);
};

