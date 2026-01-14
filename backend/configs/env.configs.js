import dotenv from "dotenv"
dotenv.config();
const ENV = {
    PORT: process.env.PORT,
    DB_PASSWORD: process.env.DB_PASSWORD,
}
export default ENV;