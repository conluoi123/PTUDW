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
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: User updated
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
   *     responses:
   *       200:
   *         description: User details
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
   *     responses:
   *       200:
   *         description: User deleted
   */
  router.delete("/:userId", authenticateAccessToken, deleteUser);
  app.use("/api/admin", router);
};

export default adminRouter;
