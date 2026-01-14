import express from "express"
import cors from "cors";
import ENV from "./configs/env.configs.js";
import cookieParser from "cookie-parser";
import friendRouter from "./routers/friends.router.js"

const app = express();
const PORT = ENV.PORT || 3000;

app.use(express.json())
app.use(cookieParser());
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send('Web game');
})

app.use('/api/friends', friendRouter)

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
})
