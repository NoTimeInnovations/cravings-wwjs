import { configDotenv } from "dotenv";
configDotenv();

const PORT = process.env.PORT || 3000;
const ENV = process.env.ENV || "dev";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const SERVICE_ACCOUNT_KEY = process.env.SERVICE_ACCOUNT_KEY;
const CLIENT_ID = "cravings";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let ADMINS = ["916282826684@c.us" , "919809873068@c.us" , "919447156765@c.us"];

export {
  PORT,
  ENV,
  SERVER_URL,
  ADMIN_CHAT_ID,
  SERVICE_ACCOUNT_KEY,
  CLIENT_ID,
  GEMINI_API_KEY,
  ADMINS
};
