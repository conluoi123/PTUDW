import dotenv from "dotenv"
dotenv.config();
const ENV = {
    PORT: process.env.PORT,
    DB_PASSWORD: process.env.DB_PASSWORD,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
}
export default ENV;