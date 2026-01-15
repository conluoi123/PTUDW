import Rating from "../models/ratings.models.js";
import { checkExistRatings } from "../services/ratings.services.js";

const getAllRatings = async (req, res) => {
  try {
    const { gameId } = req.params;
    if (!gameId) {
      return res.status(400).json({ error: "Missing require field" });
    }
    const ratings = await Rating.getRatings(gameId);
    return res
      .status(200)
      .json({ message: "get rating successfully", ratings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const addRatings = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { point, comment } = req.body;
    if (!gameId) {
      return res.status(400).json({ error: "Missing require field" });
      }
      const isRating = await checkExistRatings(gameId, req.userId);
      if (isRating) {
          return res.status(403).json({error: "You are already rating"})
      }
    const ratings = await Rating.addRate(gameId, req.userId, point, comment);
    return res
      .status(200)
      .json({ message: "add rating successfully", ratings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { point, comment } = req.body;
    if (!gameId) {
      return res.status(400).json({ error: "Missing require field" });
    }
    const ratings = await Rating.updateRate(ratingId, point, comment);
    return res
      .status(200)
      .json({ message: "update rating successfully", ratings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
const deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    if (!gameId) {
      return res.status(400).json({ error: "Missing require field" });
    }
    await Rating.deleteRate(ratingId);
    return res
      .status(200)
      .json({ message: "delete rating successfully"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export { getAllRatings, addRatings, updateRating, deleteRating };
