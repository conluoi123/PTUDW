import Router from "express"

const rankingRouter = (app) => {
    const router = Router();
    app.use("/api/rankings", router)
}

export default rankingRouter