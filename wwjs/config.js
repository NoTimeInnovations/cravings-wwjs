import wwcli from "whatsapp-web.js";
import { ADMIN_CHAT_ID, CLIENT_ID } from "../utils/env.js";
import log from "../utils/log.js";
import { generateQR, writeQRToFile } from "../utils/generateQR.js";
import commandConfig from "../utils/commandConfig.js";
import { startScheduledMessages } from "../firebase/startListeningToOffers.js";

const { Client, LocalAuth } = wwcli;

const whatsapp = new Client({
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--disable-extensions",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--no-first-run",
      "--no-zygote",
    ],
  },
  authStrategy: new LocalAuth({
    clientId: "cravings",
  }),
});

whatsapp.on("qr", async (qr) => {
  await generateQR(qr);
});

whatsapp.on("loading_screen", () => {
  log("Loading......");
  writeQRToFile("<h1>Loading......</h1>");
});

whatsapp.on("ready", async () => {
  log("Client is ready!");
  sendMessage("Client is ready!");
  writeQRToFile("<h1>Client is ready!</h1>");
  await startScheduledMessages();
});

whatsapp.on("message_create", async (msg) => {
  const action = commandConfig[msg.body];
  if (action) {
    await action(msg);
  }
});


function sendMessage(message, to = ADMIN_CHAT_ID) {
  try {
    whatsapp.sendMessage(to, message);
  } catch (error) {
    console.error("Failed to send message to " + to + "\n\n" + error);
  }
}

function reply(msg, message) {
  try {
    msg.reply(message);
  } catch (error) {
    console.error("Failed to reply to message of " + msg.from + "\n\n" + error);
  }
}

export { whatsapp, sendMessage, reply };
