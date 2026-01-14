import messageControllers from "../controllers/message.controllers.js";
import { Router } from "express";
const router = Router();

router.post("/", messageControllers.createMessage);


export default router;