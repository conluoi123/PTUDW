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
 *     responses:
 *       200:
 *         description: Request sent
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
 *     responses:
 *       200:
 *         description: Request accepted
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
 *     responses:
 *       200:
 *         description: Friend removed
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
 *     responses:
 *       200:
 *         description: Friendship status
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
 */
router.get('/find', friendController.findUserById)

export default router;
