import { Router } from "express";
import { deleteUser } from "../controllers/admin.controllers.js";

const adminRouter = (app) => {
    const router = Router();
    router.delete("/:userId", deleteUser);
    app.use("/api/admin", router);
}

export default adminRouter