import db from "../models/db.js";

class Ranking {
  // Ranking global cho 1 game cụ thể
  static rankingGlobal = async (gameId) => {
    try {
      const ranking = await db
        .select(
          "u.id as user_id",
          "u.name",
          "u.username",
          "u.avatar",
          "t.max_score",
          "t.total_games",
          db.raw("RANK() OVER (ORDER BY t.max_score DESC) as ranking")
        )
        .from(function () {
          this.select("user_id")
            .max("score as max_score")
            .count("* as total_games")
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

  // Ranking global OVERALL (tất cả games)
  static rankingGlobalOverall = async () => {
    try {
      const ranking = await db
        .select(
          "u.id as user_id",
          "u.name",
          "u.username",
          "u.avatar",
          "t.total_score",
          "t.total_games",
          db.raw("RANK() OVER (ORDER BY t.total_score DESC) as ranking")
        )
        .from(function () {
          this.select("user_id")
            .sum("score as total_score")
            .count("* as total_games")
            .from("game_sessions")
            .groupBy("user_id")
            .as("t");
        })
        .join("users as u", "t.user_id", "u.id")
        .orderBy("ranking", "asc")
        .limit(100);

      return ranking;
    } catch (error) {
      throw new Error("Error get overall ranking: " + error.message);
    }
  };

  // Ranking user cá nhân cho 1 game
  static rankingUser = async (gameId, userId) => {
    try {
      const ranking = await db("game_sessions")
        .select("score", "duration", "result", "played_at")
        .where({
          game_id: gameId,
          user_id: userId,
        })
        .orderBy("score", "desc");

      return ranking;
    } catch (error) {
      throw error;
    }
  };

  // Personal stats tổng hợp (all games)
  static getPersonalStatsOverall = async (userId) => {
    try {
      // Overall stats
      const overall = await db("game_sessions")
        .select(
          db.raw("COUNT(*) as total_games"),
          db.raw("SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as total_wins"),
          db.raw("SUM(CASE WHEN result = 'lose' THEN 1 ELSE 0 END) as total_losses"),
          db.raw("SUM(score) as total_score")
        )
        .where("user_id", userId)
        .first();

      // Stats by game
      const byGame = await db("game_sessions as gs")
        .join("games as g", "gs.game_id", "g.id")
        .select(
          "g.id as game_id",
          "g.name as game_name",
          db.raw("COUNT(*) as played"),
          db.raw("SUM(CASE WHEN gs.result = 'win' THEN 1 ELSE 0 END) as won"),
          db.raw("MAX(gs.score) as high_score")
        )
        .where("gs.user_id", userId)
        .groupBy("g.id", "g.name")
        .orderBy("played", "desc");

      // Get user global rank
      const userRank = await db
        .select(db.raw("COUNT(*) + 1 as rank"))
        .from(function () {
          this.select("user_id")
            .sum("score as total_score")
            .from("game_sessions")
            .groupBy("user_id")
            .having(db.raw("SUM(score) > (SELECT SUM(score) FROM game_sessions WHERE user_id = ?)", [userId]))
            .as("t");
        })
        .first();

      return {
        overall: {
          ...overall,
          rank: parseInt(userRank.rank) || 1,
          bestStreak: 0,
          currentStreak: 0
        },
        byGame
      };
    } catch (error) {
      throw new Error("Error get personal stats: " + error.message);
    }
  };

  // Ranking friends cho 1 game
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
          "u.id as user_id",
          "u.name",
          "u.username",
          "u.avatar",
          "t.max_score",
          "t.total_games",
          db.raw("RANK() OVER (ORDER BY t.max_score DESC) as ranking")
        )
        .from(function () {
          this.select("user_id")
            .max("score as max_score")
            .count("* as total_games")
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

  // Ranking friends OVERALL (tất cả games)
  static rankingFriendsOverall = async (userId) => {
    try {
      const friendIds = db("friends")
        .where("user_id_01", userId)
        .select("user_id_02 as id")
        .union(
          db("friends").where("user_id_02", userId).select("user_id_01 as id")
        );

      const ranking = await db
        .select(
          "u.id as user_id",
          "u.name",
          "u.username",
          "u.avatar",
          "t.total_score",
          "t.total_games",
          db.raw("RANK() OVER (ORDER BY t.total_score DESC) as ranking")
        )
        .from(function () {
          this.select("user_id")
            .sum("score as total_score")
            .count("* as total_games")
            .from("game_sessions")
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
      throw new Error("Error get friends overall ranking: " + error.message);
    }
  };
}

export default Ranking;
