
import Rating from "../models/ratings.models.js";

async function checkExistRatings(gameId, userId) {
    const rate = await Rating.isRatingForGame(gameId, userId);
    if (!rate) {
        return false;
    }
    return true;
}

export {checkExistRatings}