import express from "express"
import cors from "cors";
import ENV from "./configs/env.configs.js";
import userRouter from "./routers/user.routes.js";
import cookieParser from "cookie-parser";
import db from "./configs/db.js";

const app = express(); 
// đọc từ file .env 
const PORT = ENV.PORT || 3000;

app.use(express.json())
app.use(cookieParser());
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
  })
);

app.get('/', (req,res)=> {
    res.send('Web game');
})
userRouter(app);


//=================== ROUTERS =====================
import MessageRouter from "./routers/message.routers.js";
import GameRouter from "./routers/game.routers.js";
//================================================


//=================== API =========================
app.use("/api/messages", MessageRouter);
app.use("/api/games", GameRouter);
/*
    [{"id":"add3473d-5391-43ff-942d-d1e29225a5db"},{"id":"60895966-8a03-40e1-94e1-f45565168e20"}]
*/
//================================================

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
})