import express from 'express'
import * as friendController from '../controllers/friends.controller.js'

const router = express.Router()

/**
 * @swagger
 * /api/friends/request:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friends]
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
 *     responses:
 *       200:
 *         description: Request sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Friend request sent"
 */
router.post('/request', friendController.sendRequest)

/**
 * @swagger
 * /api/friends/accept/{id}:
 *   post:
 *     summary: Accept a friend request
 *     tags: [Friends]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "request_id_123"
 *     responses:
 *       200:
 *         description: Request accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Friend request accepted"
 */
router.post('/accept/:id', friendController.acceptRequest)

/**
 * @swagger
 * /api/friends/remove/{id}:
 *   delete:
 *     summary: Remove a friend or reject request
 *     tags: [Friends]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "friend_id_123"
 *     responses:
 *       200:
 *         description: Friend removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Friend removed"
 */
router.delete('/remove/:id', friendController.removeFriend)

/**
 * @swagger
 * /api/friends/search/{id}:
 *   get:
 *     summary: Check friendship status with a user
 *     tags: [Friends]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "user_to_check"
 *     responses:
 *       200:
 *         description: Friendship status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "friend"
 */
router.get('/search/:id', friendController.searchFriendStatus)

/**
 * @swagger
 * /api/friends/list:
 *   post:
 *     summary: Get list of friends (POST variant)
 *     tags: [Friends]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of friends
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "friend_id_123"
 *                   username:
 *                     type: string
 *                     example: "friend_name"
 */
router.get('/list', friendController.getListFriends)
router.post('/list', friendController.getListFriends)

/**
 * @swagger
 * /api/friends/requests:
 *   get:
 *     summary: Get pending friend requests
 *     tags: [Friends]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Pending requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "request_id"
 *                   sender:
 *                     type: object
 *                     properties:
 *                       username: 
 *                         type: string
 *                         example: "requester_name"
 */
router.get('/requests', friendController.getPendingRequests)

/**
 * @swagger
 * /api/friends/suggestions:
 *   get:
 *     summary: Get friend suggestions
 *     tags: [Friends]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Suggestions list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: "suggested_user"
 */
router.get('/suggestions', friendController.getSuggestions)
router.post('/suggestions', friendController.getSuggestions)

/**
 * @swagger
 * /api/friends/find:
 *   get:
 *     summary: Find user by ID or specific criteria
 *     tags: [Friends]
 *     security:
 *       - cookieAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 */
router.get('/find', friendController.findUserById)

export default router;
