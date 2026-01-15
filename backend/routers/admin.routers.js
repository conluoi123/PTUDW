import { Router } from "express";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUserInfo,
  updateUser,
} from "../controllers/admin.controllers.js";
import { authenticateAccessToken } from "../middlewares/jwt.middlewares.js";
const adminRouter = (app) => {
  const router = Router();
  router.get("/users", authenticateAccessToken, getAllUsers);
  router.put("/:userId", authenticateAccessToken, updateUser);
  router.post("/user", authenticateAccessToken, addUser);
  router.get("/:userId", authenticateAccessToken, getUserInfo);
  router.delete("/:userId", authenticateAccessToken, deleteUser);
  app.use("/api/admin", router);
};

export default adminRouter;
