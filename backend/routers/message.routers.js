import messageControllers from "../controllers/message.controllers.js";
import { Router } from "express";
const router = Router();

router.post("/", messageControllers.createMessage);
router.get("/conversation/:user_id", messageControllers.getConversation);
router.get("/history", messageControllers.getHistory);
router.get("/read", messageControllers.updateStatus);

export default router;