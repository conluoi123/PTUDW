import Rating from "../models/ratings.models.js";

const getAllRatings = async (req,res) => {
    try {
        const { gameId } = req.params;
        if (!gameId) {
            return res.status(400).json({ error: "Missing require field" });
        }
        const ratings = await Rating.getRatings(gameId);
        return res.status(200).json({ message: "get rating successfully", ratings });
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Internal server error"})
    }
}

export {getAllRatings}