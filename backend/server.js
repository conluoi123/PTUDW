import express from "express"
import cors from "cors";
import ENV from "./configs/env.configs.js";
import cookieParser from "cookie-parser";
import { userRouter } from "./routers/user.routers.js";
import ratingRouter from "./routers/ratings.routers.js";

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

userRouter(app);
ratingRouter(app);
app.get('/', (req, res) => {
  res.send('Web game');
})

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
})
