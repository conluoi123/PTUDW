import { Router } from "express";
import {
  signatureCloudinary,
  saveAvatar,
} from "../controllers/profile.controllers.js";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";
const profileRouter = (app) => {
  const router = Router();

  /**
   * @swagger
   * /api/user/profile/saveAvatar:
   *   post:
   *     summary: Check avatar and save url
   *     tags: [Profile]
   *     security:
   *       - cookieAuth: []
   *       - ApiKeyAuth: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               public_id:
   *                 type: string
   *                 example: "cloudinary_public_id_123"
   *     responses:
   *       200:
   *         description: Avatar saved
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Avatar saved successfully"
   *                 avatar:
   *                   type: string
   *                   example: "https://res.cloudinary.com/..."
   */
  router.post("/saveAvatar", authenticateAccessToken, saveAvatar);

  /**
   * @swagger
   * /api/user/profile/signature:
   *   get:
   *     summary: Get Cloudinary signature for upload
   *     tags: [Profile]
   *     security:
   *       - cookieAuth: []
   *       - ApiKeyAuth: []
   *     responses:
   *       200:
   *         description: Signature and timestamp
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 timestamp:
   *                   type: integer
   *                   example: 1705728000
   *                 signature:
   *                   type: string
   *                   example: "a1b2c3d4e5f6..."
   */
  router.get("/signature", authenticateAccessToken, signatureCloudinary);
  app.use("/api/user/profile", router);
};

export { profileRouter };
