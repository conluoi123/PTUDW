import express from "express"
import cors from "cors";
import ENV from "./models/env.configs.js";
import cookieParser from "cookie-parser";
import achievementRoutes from "./controllers/achievements/achievement.controller.js";
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

app.get('/', (req, res) => {
  res.send('Web game');
})
achievementRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`)
})
