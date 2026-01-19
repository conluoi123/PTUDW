import Ranking from "../models/ranking.models.js";

// Global ranking cho 1 game cụ thể
async function getRankingGlobal(req, res) {
  try {
    const { gameId } = req.params;
    const page = parseInt(req.body?.page || req.query?.page || 1);
    const limit = 3;
    if (!gameId) {
      return res.status(400).json({ error: "Missing gameId" });
    }
    let ranking = await Ranking.rankingGlobal(gameId, page, limit);
    let currentPage = page;

    if ((!ranking || ranking.length === 0) && page > 1) {
        ranking = await Ranking.rankingGlobal(gameId, 1, limit);
        currentPage = 1;
    }

    return res
      .status(200)
      .json({ message: "Get ranking successfully", ranking, page: currentPage, limit });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Global ranking OVERALL (all games)
async function getRankingGlobalOverall(req, res) {
  try {
    const page = parseInt(req.body?.page || req.query?.page || 1);
    const limit = 3;
    let ranking = await Ranking.rankingGlobalOverall(page, limit);
    let currentPage = page;

    if ((!ranking || ranking.length === 0) && page > 1) {
        ranking = await Ranking.rankingGlobalOverall(1, limit);
        currentPage = 1;
    }

    return res
      .status(200)
      .json({ message: "Get overall ranking successfully", ranking, page: currentPage, limit });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Personal ranking cho 1 game
async function getRanking(req, res) {
  try {
    const { gameId } = req.params;
    if (!gameId) {
      return res.status(400).json({ error: "Missing gameId" });
    }
    const ranking = await Ranking.rankingUser(gameId, req.userId);
    return res
      .status(200)
      .json({ message: "Get ranking successfully", ranking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Personal stats overall (all games)
async function getPersonalStatsOverall(req, res) {
  try {
    const stats = await Ranking.getPersonalStatsOverall(req.user.id);
    return res
      .status(200)
      .json({ message: "Get personal stats successfully", stats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Friends ranking cho 1 game
async function getRankingFriendList(req, res) {
  try {
    const { gameId } = req.params;
    const page = parseInt(req.body?.page || req.query?.page || 1);
    const limit = 3;
    if (!gameId) {
      return res.status(400).json({ error: "Missing gameId" });
    }
    let ranking = await Ranking.rankingListFriends(gameId, req.user.id, page, limit);
    let currentPage = page;
     
    if ((!ranking || ranking.length === 0) && page > 1) {
        ranking = await Ranking.rankingListFriends(gameId, req.user.id, 1, limit);
        currentPage = 1;
    }

    return res
      .status(200)
      .json({ message: "Get ranking successfully", ranking, page: currentPage, limit });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Friends ranking overall (all games)
async function getRankingFriendsOverall(req, res) {
  try {
    const page = parseInt(req.body?.page || req.query?.page || 1);
    const limit = 3;
    let ranking = await Ranking.rankingFriendsOverall(req.user.id, page, limit);
    let currentPage = page;

    if ((!ranking || ranking.length === 0) && page > 1) {
        ranking = await Ranking.rankingFriendsOverall(req.user.id, 1, limit);
        currentPage = 1;
    }

    return res
      .status(200)
      .json({ message: "Get friends ranking successfully", ranking, page: currentPage, limit });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Lỗi ở chỗ này nè" });
  }
}

export {
  getRanking,
  getRankingFriendList,
  getRankingGlobal,
  getRankingGlobalOverall,
  getRankingFriendsOverall,
  getPersonalStatsOverall
};
