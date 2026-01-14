import { Router } from "express";
import gameControllers from "../controllers/game.controllers.js";

const router = Router();
router.get("/", gameControllers.getAllGames);



export default router;