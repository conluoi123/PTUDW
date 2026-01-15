import db from "../configs/db.js"
class Rating{
    static getRatings = async (gameId) => {
        try {
            return await db("ratings").where("game_id", gameId);
        } catch (error) {
            throw new Error("Error finding ratings: " + error.message);
        }
    }
}
export default Rating