import db from "../configs/db.js";
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
        })
        .returning("*");
      return upRatings;
    } catch (error) {
      throw new Error("Error updating ratings: " + error.message);
    }
  };
}
export default Rating;
