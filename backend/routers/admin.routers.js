import { Router } from "express";
import { addUser, deleteUser, getUserInfo } from "../controllers/admin.controllers.js";

const adminRouter = (app) => {
    const router = Router();
    router.post("/user", addUser);
    router.get("/:userId", getUserInfo);
    router.delete("/:userId", deleteUser);
    app.use("/api/admin", router);
}

export default adminRouter