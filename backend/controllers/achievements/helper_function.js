import db from "../../models/db.js";
// dung de cap nhat bang user_achievements va achievements trong 1 transaction
export async function insert_user_achieve_transaction(userId, achievements) {
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
export async function insert_user_achieve(userId, achievements_id) {
  try {
    await db("user_achievements").insert({
      achievement_id: achievements_id,
      user_id: userId,
      unlocked_at: new Date(),
    }).onConflict(['achievement_id', 'user_id']).ignore();
  } catch (error) {
    console.error("Insert failed, changes rolled back:", error);
  }
}
async function load_achievements_me(req, res, next) {
  try {
    const id_user =  req.userId ;
    const user_achivement = await db("achievements as a")
      .join("user_achievements as ua", "a.id", "ua.achievement_id")
      .where("ua.user_id", id_user)
      .select("a.*");
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
    req.achievements = achievement;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
// TODO: hardcode userId, sẽ lấy từ token sau
function getUserId(req, res, next) {
  req.userId = req.userId || "972bd171-9e6f-4336-86db-8b68f8b3676d";
  next();
}
export { load_achievements_me, load_achievements_id, getUserId };
