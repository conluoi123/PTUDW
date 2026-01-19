import { Router } from "express";
import gameControllers from "../controllers/game.controllers.js";
import { saveGame, loadGame, deleteSavedGame } from "../controllers/gameState.controllers.js";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";

const router = Router();

// Game State Routes (Protected)
router.post("/save", authenticateAccessToken, saveGame);
router.get("/load", authenticateAccessToken, loadGame);
router.delete("/save/:id", authenticateAccessToken, deleteSavedGame);

// Game Management Routes
router.get("/", gameControllers.getAllGames);
router.get("/:id", gameControllers.getGameById);
// quyền admin, sau sẽ có authAdmin
router.post("/", gameControllers.createGame);
router.put("/:id", gameControllers.updateGame);
router.delete("/:id", gameControllers.deleteGame);
export default router;