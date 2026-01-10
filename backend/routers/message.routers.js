import { createMessage, getConversations, getHistory, markAsRead } from "../controllers/message.controllers.js";
import { Router } from 'express'

const router = Router();
router.post("/send", createMessage)
router.get("/conversations", getConversations);
router.get("/history", getHistory);
router.put('/read', markAsRead);
export default router;
