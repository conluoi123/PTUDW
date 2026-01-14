import dotenv from "dotenv";
dotenv.config();
const ENV = {
  PORT: process.env.PORT,
  DB_PASSWORD: process.env.DB_PASSWORD,
  GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_SECRET_CODE: process.env.GOOGLE_SECRET_CODE,
  BACKEND_URL: process.env.BACKEND_URL,
};
export default ENV;
