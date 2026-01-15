import { Router } from "express";
import gameControllers from "../controllers/game.controllers.js";

const router = Router();
router.get("/", gameControllers.getAllGames);
router.get("/:id", gameControllers.getGameById);
// quyền admin, sau sẽ có authAdmin
router.post("/", gameControllers.createGame);
router.put("/:id", gameControllers.updateGame);
router.delete("/:id", gameControllers.deleteGame);
export default router;