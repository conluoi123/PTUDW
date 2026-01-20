import { Router } from "express";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUserInfo,
  updateUser,
  getDashboardOverview,
} from "../controllers/admin.controllers.js";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";
const adminRouter = (app) => {
  const router = Router();

  /**
   * @swagger
   * /api/admin/dashboard/overview:
   *   get:
   *     summary: Get dashboard overview statistics
   *     tags: [Admin]
   *     security:
   *       - cookieAuth: []
   *       - ApiKeyAuth: []
   *     responses:
   *       200:
   *         description: Dashboard statistics
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalUsers:
   *                   type: integer
   *                   example: 120
   *                 activeUsers:
   *                   type: integer
   *                   example: 45
   *                 totalGamesPlayed:
   *                   type: integer
   *                   example: 1050
   */
  router.get("/dashboard/overview", authenticateAccessToken, getDashboardOverview);

  /**
   * @swagger
   * /api/admin/users:
   *   get:
   *     summary: Get list of all users
   *     tags: [Admin]
   *     security:
   *       - cookieAuth: []
   *       - ApiKeyAuth: []
   *     responses:
   *       200:
   *         description: List of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     example: "user123"
   *                   username:
   *                     type: string
   *                     example: "john_doe"
   *                   role:
   *                     type: string
   *                     example: "user"
   *                   status:
   *                     type: string
   *                     example: "active"
   */
  router.get("/users", authenticateAccessToken, getAllUsers);

  /**
   * @swagger
   * /api/admin/{userId}:
   *   put:
   *     summary: Update a user
   *     tags: [Admin]
   *     security:
   *       - cookieAuth: []
   *       - ApiKeyAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         example: "user123"
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               role:
   *                 type: string
   *                 example: "admin"
   *               status:
   *                 type: string
   *                 example: "banned"
   *     responses:
   *       200:
   *         description: User updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "User updated"
   */
  router.put("/:userId", authenticateAccessToken, updateUser);

  /**
   * @swagger
   * /api/admin/user:
   *   post:
   *     summary: Create a new user (Admin)
   *     tags: [Admin]
   *     security:
   *       - cookieAuth: []
   *       - ApiKeyAuth: []
   *     responses:
   *       201:
   *         description: User created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                    type: string
   *                    example: "User created"
   *                 user:
   *                    type: object
   */
  router.post("/user", authenticateAccessToken, addUser);

  /**
   * @swagger
   * /api/admin/{userId}:
   *   get:
   *     summary: Get specific user details
   *     tags: [Admin]
   *     security:
   *       - cookieAuth: []
   *       - ApiKeyAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         example: "user123"
   *     responses:
   *       200:
   *         description: User details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "user123"
   *                 username:
   *                   type: string
   *                   example: "john_doe"
   */
  router.get("/:userId", authenticateAccessToken, getUserInfo);

  /**
   * @swagger
   * /api/admin/{userId}:
   *   delete:
   *     summary: Delete a user
   *     tags: [Admin]
   *     security:
   *       - cookieAuth: []
   *       - ApiKeyAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *         example: "user123"
   *     responses:
   *       200:
   *         description: User deleted
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "User deleted"
   */
  router.delete("/:userId", authenticateAccessToken, deleteUser);
  app.use("/api/admin", router);
};

export default adminRouter;
