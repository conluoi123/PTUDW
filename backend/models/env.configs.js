import dotenv from "dotenv";
dotenv.config();
const ENV = {
  PORT: process.env.PORT,
  DB_PASSWORD: process.env.DB_PASSWORD,
  GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_SECRET_ID: process.env.GOOGLE_SECRET_ID,
  GOOGLE_LOGIN_URL: process.env.GOOGLE_LOGIN_URL,
  BACKEND_URL: process.env.BACKEND_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
};
export default ENV;
