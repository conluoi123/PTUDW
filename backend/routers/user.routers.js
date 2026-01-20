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
   *         description: Redirect to Google
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
   *     responses:
   *       200:
   *         description: Login successful
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
   *         description: Token refreshed
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
   *         description: User rank
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
   *         description: Total games
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
   *     responses:
   *       200:
   *         description: Profile updated
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
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
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
   *               password:
   *                 type: string
   *               email:
   *                 type: string
   *     responses:
   *       201:
   *         description: User registered successfully
   */
  router.post("/register", Register);
  app.use("/api/user", router);
};

export { userRouter };