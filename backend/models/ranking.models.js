import db from "../models/db.js";

class Ranking {
  static rankingGlobal = async (gameId) => {
    try {
      const ranking = await db
        .select(
          "u.name",
          "u.username",
          "t.max_score",
          db.raw("RANK() OVER (ORDER BY t.max_score DESC) as ranking")
        )
        .from(function () {
          this.select("user_id")
            .max("score as max_score")
            .from("game_sessions")
            .where("game_id", gameId)
            .groupBy("user_id")
            .as("t");
        })
        .join("users as u", "t.user_id", "u.id")
        .orderBy("ranking", "asc");

      return ranking;
    } catch (error) {
      throw new Error("Error get ranking global: " + error.message);
    }
  };

  static rankingUser = async (gameId, userId) => {
    try {
      const ranking = await db("game_sessions")
        .select("score", "duration", "result", "played_at")
        .where({
          game_id: gameId,
          user_id: userId,
        })
        .orderBy("score", "desc"); // Điểm cao nhất của bạn sẽ lên đầu

      return ranking;
    } catch (error) {
      throw error;
    }
  };
  static rankingListFriends = async (gameId, userId) => {
    try {
      const friendIds = db("friends")
        .where("user_id_01", userId)
        .select("user_id_02 as id")
        .union(
          db("friends").where("user_id_02", userId).select("user_id_01 as id")
        );

      const ranking = await db
        .select(
          "u.name",
          "t.max_score",
          db.raw("RANK() OVER (ORDER BY t.max_score DESC) as ranking")
        )
        .from(function () {
          this.select("user_id")
            .max("score as max_score")
            .from("game_sessions")
            .where("game_id", gameId)
            .whereIn("user_id", function () {
              this.select("id")
                .from(friendIds.as("all_friends"))
                .union(db.raw("select ?", [userId]));
            })
            .groupBy("user_id")
            .as("t");
        })
        .join("users as u", "t.user_id", "u.id")
        .orderBy("ranking", "asc");

      return ranking;
    } catch (error) {
      throw error;
    }
  };
}
export default Ranking;
