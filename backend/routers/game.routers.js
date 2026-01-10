import { Router } from 'express';
import { getAllGames, getGameById, createGame, updateGame, deleteGame } from "../controllers/game.controllers.js";

const router = Router();
router.get('/', getAllGames);
router.get('/:id', getGameById);
// sau khi có middleware chỗ này thêm cái authAdmin
router.post('/', createGame);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);
export default router;
