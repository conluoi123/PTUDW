import Ranking from "../models/ranking.models.js";

async function getRankingGlobal(req, res) {
  try {
    const { gameId } = req.params;
    if (!gameId) {
      return res.status(400).json({ error: "Missing gameId" });
    }
    const ranking = await Ranking.rankingGlobal(gameId);
    return res
      .status(200)
      .json({ message: "Get ranking succesfully", ranking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getRanking(req, res) {
  try {
    const { gameId } = req.params;
    if (!gameId) {
      return res.status(400).json({ error: "Missing gameId" });
    }
    const ranking = await Ranking.rankingUser(gameId, req.userId);
    return res
      .status(200)
      .json({ message: "Get ranking succesfully", ranking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getRankingFriendList(req, res) {}

export { getRanking, getRankingFriendList, getRankingGlobal };
