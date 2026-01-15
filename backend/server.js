import express from "express"
import cors from "cors";
import ENV from "./models/env.configs.js";
import cookieParser from "cookie-parser";

import { userRouter } from "./routers/user.routers.js";
import ratingRouter from "./routers/ratings.routers.js";

import adminRouter from "./routers/admin.routers.js";
import friendRouter from "./routers/friends.router.js"
import rankingRouter from "./routers/ranking.routers.js";
import achievementRoutes from "./controllers/achievements/achievement.controller.js";
const app = express();
const PORT = ENV.PORT || 3000;

app.use(express.json())
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

//userRouter(app);
//adminRouter(app);
rankingRouter(app);
ratingRouter(app);
app.get('/', (req, res) => {
  res.send('Web game');
})
achievementRoutes(app);


//======================= MIDDLEWARE =======================



//======================= ROUTER =======================
// GAMES
import gameRouter from "./routers/game.routers.js";
app.use("/api/games", gameRouter);

// MESSAGES 
import messageRouter from "./routers/message.routers.js";
app.use("/api/messages", messageRouter);



app.use('/api/friends', friendRouter)


app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
})
