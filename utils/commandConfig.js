import { sendMessage, whatsapp } from "../wwjs/config.js";
import fs from "fs";
import path from "path";
import { getUserPhone } from "../firebase/getUserPhone.js";
import { gemini, geminiJson } from "../gemini/gemini.js";
import wwjs from "whatsapp-web.js";
import { ADMINS } from "./env.js";
const { MessageMedia } = wwjs;

function test(msg, extra) {
  sendMessage("This is a test message", msg.from);
}

function log(msg, extra) {
  const filePath = path.resolve("data/log.txt");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    sendMessage(data, msg.from);
  });
}

function clearLog(msg, extra) {
  const filePath = path.resolve("data/log.txt");
  fs.writeFile(filePath, "", (err) => {
    if (err) {
      console.error(err);
      return;
    }
    sendMessage("Log cleared!", msg.from);
  });
}

async function viewUsers(msg, extra) {
  const users = await getUserPhone();
  const usersString = users.join("\n");
  sendMessage(usersString, msg.from);
}

async function sendPost(msg, extra) {
  const response = await geminiJson.generateContent(
    "text=" + extra + "dont include the price unit use quntity"
  );

  const data = JSON.parse(response.response.text());

  const imageUrl = msg.links[0].link;

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

async function aiHelp(msg, extra) {
  const message = extra;
  const quotedMsg =
    msg?._data?.quotedMsg?.body || msg?._data?.quotedMsg?.caption || "";

  const query = `${quotedMsg} ${message}`;

  const response = await gemini.generateContent(query);
  const data = response.response.text();

  sendMessage(data, msg.from);
}

async function deleteLastMsg(msg, extra) {
  const chats = await whatsapp.getChats();
  let filter = extra.split(" ")[0];
  const msgToDelete = extra.split(" ").slice(1).join(" ");

  console.log(filter);
  console.log(msgToDelete);

  if (filter === "all") {
    for (const chat of chats) {
      if (chat.lastMessage.body.includes(msgToDelete)) {
        try {
          const msgs = await chat.fetchMessages({ limit: 1 , fromMe: true});
          const msg = msgs[0];
          await msg.delete(true);
        } catch (error) {
          console.log(
            "Failed to delete last message of " + chat.name + "\n\n" + error
          );
        }
      }
    }
  } else {
    for (const chat of chats) {
      if (chat.id.user === filter) {
        try {
          const msgs = await chat.fetchMessages({ limit: 1 , fromMe: true});
          const msg = msgs[0];
          console.log(msg);
          
          await msg.delete(true);
        } catch (error) {
          console.log(
            "Failed to delete last message of " + chat.name + "\n\n" + error
          );
        }
      }
    }
  }
}

const commandConfig = {
  "#test": test,
  "#log": log,
  "#clearLog": clearLog,
  "#users": viewUsers,
  "#post": sendPost,
  "#help": help,
  "#ai": aiHelp,
  "#delete-last-msg": deleteLastMsg,
};

const commandDescriptions = {
  "#test": "Test the bot",
  "#log": "View the log",
  "#clearLog": "Clear the log",
  "#users": "View the users",
  "#post": "Post a new offer message",
  "#help": "View the list of commands",
  "#ai": "Get AI help (can be used with a quoted message)",
  "#delete-last-msg": "Delete last message of all chats",
};

async function help(msg) {
  const commands = Object.entries(commandDescriptions)
    .map(([command, description]) => `${command}: ${description}`)
    .join("\n");
  sendMessage(commands, msg.from);
}

export default commandConfig;
