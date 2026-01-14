import db from "../../configs/db.js";
export async function insert_user_achieve(userId, achievements) {
  try {
    await db.transaction(async (trx) => {
      const [result] = await trx("achievements")
        .insert({
          name: achievements.name,
          game_id: achievements.game_id,
          score: achievements.score,
        })
        .returning("id");

      const achieve_id = result.id || result;

      await trx("user_achievements").insert({
        achievement_id: achieve_id,
        user_id: userId,
      });

      console.log(`Success! Created User ${achieve_id} and their settings.`);
    });
  } catch (error) {
    console.error("Insert failed, changes rolled back:", error);
  }
}

async function load_achievements_me(req, res, next) {
  try {
    const id_user = req.userId;
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
  req.userId = req.userId || "58446a41-0366-4322-87eb-ea6a3c34bc8e";
  next();
}
export { load_achievements_me, load_achievements_id, getUserId };
