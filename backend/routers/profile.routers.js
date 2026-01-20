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
   *     responses:
   *       200:
   *         description: Avatar saved
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
   */
  router.get("/signature", authenticateAccessToken, signatureCloudinary);
  app.use("/api/user/profile", router);
};

export { profileRouter };
