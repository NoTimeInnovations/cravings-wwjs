import { sendMessage, whatsapp } from "../wwjs/config.js";
import fs from "fs";
import path from "path";
import { getUserPhone } from "../firebase/getUserPhone.js";
import { geminiJson } from "../gemini/gemini.js";
import wwjs from "whatsapp-web.js";
import { ADMINS } from "./env.js";
const { MessageMedia } = wwjs;

function test() {
  sendMessage("This is a test message");
}

function log() {
  const filePath = path.resolve("data/log.txt");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    sendMessage(data);
  });
}

function clearLog() {
  const filePath = path.resolve("data/log.txt");
  fs.writeFile(filePath, "", (err) => {
    if (err) {
      console.error(err);
      return;
    }
    sendMessage("Log cleared!");
  });
}

async function viewUsers() {
  const users = await getUserPhone();
  const usersString = users.join("\n");
  sendMessage(usersString);
}

async function sendPost(msg, extra) {
  const response = await geminiJson.generateContent(
    "text=" + extra + "dont include the price unit use quntity"
  );

  const data = JSON.parse(response.response.text());

  const imageUrl = msg.links[0].link;

  console.log(imageUrl, msg.links);

  const media = await MessageMedia.fromUrl(imageUrl, { unsafeMime: true });

  const message = `🎉 New FoodieOffer Alert! 🎉\n\nDish: ${data.dishName}\nPrice: ${data.newPrice}RS\n\nCheck out our latest offer: https://cravings.live/offers/\n\nHurry, don't miss out! 🏃‍♂️💨`;

  const users = ADMINS;

  for (const user of users) {
    try {
      await whatsapp.sendMessage(user, message, { media });
    } catch (error) {
      log("Failed to send offer link to " + user + "\n\n" + error);
    }
  }
}

const commandConfig = {
  "#test": test,
  "#log": log,
  "#clearLog": clearLog,
  "#users": viewUsers,
  "#post": sendPost,
};

export default commandConfig;
