import GameState from "../models/gameState.models.js";

async function saveGame(req, res) {
  try {
    const userId = req.user.id; // From authenticateAccessToken
    const { gameId, name, data } = req.body;

    if (!gameId || !name || !data) {
      return res.status(400).json({ error: "Missing required fields: gameId, name, data" });
    }

    const savedState = await GameState.save(userId, gameId, name, data);
    return res.status(200).json({ 
        message: "Game saved successfully", 
        data: savedState 
    });
  } catch (error) {
    console.error("Save game error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function loadGame(req, res) {
  try {
    const userId = req.user.id; // From authenticateAccessToken
    
    const games = await GameState.loadAll(userId);
    return res.status(200).json({ 
        message: "Games loaded successfully", 
        data: games 
    });
  } catch (error) {
    console.error("Load game error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteSavedGame(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await GameState.delete(userId, id);
    if (!deleted || deleted.length === 0) {
        return res.status(404).json({ error: "Saved game not found or not authorized" });
    }

    return res.status(200).json({ 
        message: "Saved game deleted successfully", 
        data: deleted 
    });
  } catch (error) {
    console.error("Delete saved game error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export { saveGame, loadGame, deleteSavedGame };
