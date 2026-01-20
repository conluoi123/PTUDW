import messageControllers from "../controllers/message.controllers.js";
import { Router } from "express";
const router = Router();

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent
 */
router.post("/", messageControllers.createMessage);

/**
 * @swagger
 * /api/messages/conversation/{user_id}:
 *   get:
 *     summary: Get conversation with a user
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation history
 */
router.get("/conversation/:user_id", messageControllers.getConversation);
router.post("/conversation/:user_id", messageControllers.getConversation);

/**
 * @swagger
 * /api/messages/history:
 *   get:
 *     summary: Get list of recent conversations
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Message history
 */
router.get("/history", messageControllers.getHistory);

/**
 * @swagger
 * /api/messages/read:
 *   put:
 *     summary: Mark messages as read
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put("/read", messageControllers.updateStatus);

export default router;