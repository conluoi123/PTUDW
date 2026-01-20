import { Router } from "express";
import { SignInWithGG, DirectGoogle, Register, Login, Logout, getProfile, updateProfile, refreshAccessToken, authMe, getTotalGame, getRanking } from "../controllers/user.controllers.js";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";
const userRouter = (app) => {
  const directRouter = Router();

  /**
   * @swagger
   * /api/user/login/google:
   *   get:
   *     summary: Login with Google
   *     tags: [User]
   *     security:
   *       - ApiKeyAuth: []
   *     responses:
   *       302:
   *         description: Redirects to Google OAuth page
   */
  directRouter.get("/google", DirectGoogle);
  app.use("/api/user/login", directRouter);
  const callbackRouter = Router();

  /**
   * @swagger
   * /api/user/login/google/callback:
   *   get:
   *     summary: Google Login Callback
   *     tags: [User]
   *     security:
   *       - ApiKeyAuth: []
   *     parameters:
   *       - in: query
   *         name: code
   *         schema:
   *           type: string
   *         description: The authorization code returned by Google
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Login successful"
   *                 user:
   *                   type: object
   *                   properties:
   *                     id: 
   *                       type: string
   *                     username:
   *                       type: string
   *                     avatar:
   *                       type: string
   */
  callbackRouter.get("/google/callback", SignInWithGG);
  app.use("/api/user/login", callbackRouter);
  const router = Router();

  /**
   * @swagger
   * /api/user/refreshAccessToken:
   *   post:
   *     summary: Refresh Access Token
   *     tags: [User]
   *     security:
   *       - refreshCookieAuth: []
   *       - ApiKeyAuth: []
   *     responses:
   *       200:
   *         description: Token refreshed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Token refreshed"
   */
  router.post("/refreshAccessToken", refreshAccessToken);

  /**
   * @swagger
   * /api/user/me:
   *   get:
   *     summary: Get current user profile
   *     tags: [User]
   *     security:
   *       - cookieAuth: []
   *       - ApiKeyAuth: []
   *     responses:
   *       200:
   *         description: The user profile
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   example: "60d0fe4f5311236168a109ca"
   *                 username:
   *                   type: string
   *                   example: "john_doe"
   *                 email:
   *                   type: string
   *                   example: "john@example.com"
   *                 role:
   *                   type: string
   *                   example: "user"
   *                 avatar:
   *                   type: string
   *                   example: "https://example.com/avatar.jpg"
   *       401:
   *         description: Unauthorized
   */
  router.get("/me", authenticateAccessToken, authMe);

  /**
   * @swagger
   * /api/user/rank:
   *   get:
   *     summary: Get user rank
   *     tags: [User]
   *     security:
   *       - cookieAuth: []
   *       - ApiKeyAuth: []
   *     responses:
   *       200:
   *         description: User rank details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 rank:
   *                   type: integer
   *                   example: 5
   *                 matches:
   *                   type: integer
   *                   example: 100
   *                 winRate:
   *                   type: number
   *                   example: 55.5
   */
  router.get("/rank", authenticateAccessToken, getRanking)

  /**
   * @swagger
   * /api/user/totalGame:
   *   get:
   *     summary: Get total games played
   *     tags: [User]
   *     security:
   *       - cookieAuth: []
   *       - ApiKeyAuth: []
   *     responses:
   *       200:
   *         description: Total games count
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalGames:
   *                   type: integer
   *                   example: 150
   */
  router.get("/totalGame", authenticateAccessToken, getTotalGame);

  /**
   * @swagger
   * /api/user/profile:
   *   patch:
   *     summary: Update profile
   *     tags: [User]
   *     security:
   *       - cookieAuth: []
   *       - ApiKeyAuth: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               fullname:
   *                 type: string
   *                 example: "John Doe"
   *               bio:
   *                 type: string
   *                 example: "Gamer life"
   *     responses:
   *       200:
   *         description: Profile updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Update successfully"
   */
  router.patch("/profile", authenticateAccessToken, updateProfile);

  /**
   * @swagger
   * /api/user/profile:
   *   get:
   *     summary: Get profile
   *     tags: [User]
   *     security:
   *       - cookieAuth: []
   *       - ApiKeyAuth: []
   *     responses:
   *       200:
   *         description: Profile data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   properties:
   *                     username:
   *                        type: string
   *                     email:
   *                        type: string
   */
  router.get("/profile", authenticateAccessToken, getProfile);

  /**
   * @swagger
   * /api/user/logout:
   *   post:
   *     summary: Logout user
   *     tags: [User]
   *     security:
   *       - ApiKeyAuth: []
   *     responses:
   *       200:
   *         description: Logged out
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Logged out successfully"
   */
  router.post("/logout", Logout);

  /**
   * @swagger
   * /api/user/login:
   *   post:
   *     summary: Login user
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *                 example: "admin"
   *               password:
   *                 type: string
   *                 format: password
   *                 example: "123456"
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Login successful"
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     username:
   *                       type: string
   *       401:
   *         description: Invalid credentials
   */
  router.post("/login", Login);

  /**
   * @swagger
   * /api/user/register:
   *   post:
   *     summary: Register a new user
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *               - email
   *             properties:
   *               username:
   *                 type: string
   *                 example: "newuser"
   *               password:
   *                 type: string
   *                 format: password
   *                 example: "password123"
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "newuser@example.com"
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "User registered successfully"
   */
  router.post("/register", Register);
  app.use("/api/user", router);
};

export { userRouter };