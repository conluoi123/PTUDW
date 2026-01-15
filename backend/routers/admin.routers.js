import { Router } from "express";
import { addUser, deleteUser, getAllUsers, getUserInfo, updateUser } from "../controllers/admin.controllers.js";

const adminRouter = (app) => {
    const router = Router();
    router.get("/users", getAllUsers)
    router.put("/:userId", updateUser);
    router.post("/user", addUser);
    router.get("/:userId", getUserInfo);
    router.delete("/:userId", deleteUser);
    app.use("/api/admin", router);
}

export default adminRouter