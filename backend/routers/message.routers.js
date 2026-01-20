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
 *                 example: "friend_id_123"
 *               content:
 *                 type: string
 *                 example: "Hello world"
 *     responses:
 *       200:
 *         description: Message sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Message sent"
 *                 data:
 *                   type: object
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
 *         example: "friend_id_123"
 *     responses:
 *       200:
 *         description: Conversation history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   senderId:
 *                     type: string
 *                     example: "user123"
 *                   content:
 *                     type: string
 *                     example: "Hi there"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-20T10:00:00Z"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   lastMessage:
 *                     type: string
 *                     example: "See you later"
 *                   partner:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         example: "friend_name"
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
 *                 example: "friend_id_123"
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Messages marked as read"
 */
router.put("/read", messageControllers.updateStatus);

export default router;