import { Router } from "express";
import { deleteUser, getUserInfo } from "../controllers/admin.controllers.js";

const adminRouter = (app) => {
    const router = Router();
    router.get("/:userId", getUserInfo);
    router.delete("/:userId", deleteUser);
    app.use("/api/admin", router);
}

export default adminRouter