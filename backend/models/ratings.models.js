import db from "../models/db.js";
class Rating {
  static getRatings = async (gameId) => {
    try {
      return await db("ratings").where("game_id", gameId);
    } catch (error) {
      throw new Error("Error finding ratings: " + error.message);
    }
  };
  static isRatingForGame = async (gameId, userId) => {
    try {
      const rating = await db("ratings")
        .where({
          user_id: userId,
          game_id: gameId,
        })
        .first();

      return rating || null;
    } catch (error) {
      throw new Error("Error fetching rating: " + error.message);
    }
  };
  static addRate = async (gameId, userId, point, comment) => {
    try {
      const [newRatings] = await db("ratings")
        .insert({
          user_id: userId,
          game_id: gameId,
          point,
          comment,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
      return newRatings;
    } catch (error) {
      throw new Error("Error adding ratings: " + error.message);
    }
  };
  static updateRate = async (ratingId, point, comment) => {
    try {
      const upRatings = await db("ratings")
        .where("id", ratingId)
        .update({
          point,
          comment,
          updated_at: new Date(),
        })
        .returning("*");
      return upRatings;
    } catch (error) {
      throw new Error("Error updating ratings: " + error.message);
    }
  };
  static deleteRate = async (ratingId) => {
    try {
      return await db("ratings")
        .where("id", ratingId)
        .del();
    } catch (error) {
      throw new Error("Error deleting ratings: " + error.message);
    }
  }

  // lấy hết tất cả các đánh giá để hiển thị trang Home
  static getAllRatings = async () => {
    try {
      return await db("ratings")
        .join("users", "ratings.user_id", "users.id")
        .join("games", "ratings.game_id", "games.id")
        .select(
          "ratings.id",
          "ratings.point",
          "ratings.comment",
          "ratings.created_at",
          "users.name as user_name",
          "users.username as user_username",
          "users.avatar as user_avatar",
          "games.name as game_name",
          "games.id as game_id"
        )
        .orderBy("ratings.created_at", "desc")
        .limit(6); // Limit to 6 most recent reviews for homepage
    } catch (err) {
      console.error(err);
      throw new Error("Error get list ratings");
    }
  }
}
export default Rating;
