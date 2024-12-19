import { configDotenv } from "dotenv";
configDotenv();

const PORT = process.env.PORT || 3000;
const ENV = process.env.ENV || "dev";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const SERVICE_ACCOUNT_KEY = process.env.SERVICE_ACCOUNT_KEY;
const CLIENT_ID = "cravings";

export { PORT, ENV, SERVER_URL, ADMIN_CHAT_ID, SERVICE_ACCOUNT_KEY, CLIENT_ID };
