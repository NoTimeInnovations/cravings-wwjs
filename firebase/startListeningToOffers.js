import wwjs from "whatsapp-web.js";
import { ADMINS, ENV, SERVER_URL } from "../utils/env.js";
import { whatsapp } from "../wwjs/config.js";
import { getUserPhone } from "./getUserPhone.js";
import log from "../utils/log.js";
import { gemini } from "../gemini/gemini.js";
import { generateImageUrl, generateRandomFoodItem } from "../utils/generateImage.js";

const { MessageMedia } = wwjs;

export let users = [];
let imageUrl;

/**
 * Initializes the users list based on the environment.
 */
export async function initializeUsers() {
  users = ENV === "dev" ? ADMINS : await getUserPhone();
}

/**
 * Generates a message using Gemini AI.
 * @param {string} period - The time of day (morning, afternoon, evening).
 * @returns {Promise<string>} The generated message.
 */
async function generateAIMessage(period) {
  const commonPrompt = 
    "Create a short, funny,message with a call to action to visit the website and check out the offers. Use emojis.";

  try {
    const aiResponse = await gemini.generateContent(
      `Create a ${period} offer message for our users at https://www.cravings.live. ${commonPrompt}`
    );
    return aiResponse.response.text();
  } catch (error) {
    console.error("AI message generation failed:", error);
    return null;
  }
}

/**
 * Generates and sends scheduled messages at specific times.
 */
async function sendScheduledMessages() {
  if (users.length === 0) await initializeUsers();

  const now = new Date();
  const [hours, minutes, seconds] = [now.getHours(), now.getMinutes(), now.getSeconds()];

  const schedule = {
    "8:0:0": "morning",
    "12:0:0": "afternoon",
    "16:30:0": "evening",
  };

  const period = schedule[`${hours}:${minutes}:${seconds}`];
  if (!period) return;

  const foodItem = await generateRandomFoodItem();
  imageUrl = generateImageUrl(foodItem);

  console.log(imageUrl);
  

  const defaultMessages = {
    morning: "🌅 Good Morning! 🌅\n\nExciting new offers are available this morning! 🌟\nCheck them out now at https://www.cravings.live 🍽️",
    afternoon: "🌞 Good Afternoon! 🌞\n\nAmazing new offers are available this noon! 🌟\nDon't miss out, check them out at https://www.cravings.live 🍽️",
    evening: "🌇 Good Evening! 🌇\n\nUnwind with our special evening offers! 🌟\nDiscover them now at https://www.cravings.live 🍽️",
  };

  let message = defaultMessages[period];
  const aiMessage = await generateAIMessage(period);
  if (aiMessage) message = aiMessage;

  console.log("Final Message:", message);

  let media;
  try {
    media = await MessageMedia.fromUrl(imageUrl, { unsafeMime: true });
  } catch {
    media = await MessageMedia.fromUrl(`${SERVER_URL}/image`, { unsafeMime: true });
  }

  if (message && media) {
    for (const user of users) {
      try {
        await whatsapp.sendMessage(user, message, { media });
      } catch (error) {
        log(`Failed to send message to ${user}:`, error);
      }
    }
  }
}

/**
 * Starts the scheduled message service.
 */
export function startScheduledMessages() {
  setInterval(sendScheduledMessages, 1000); // Check every second
  setInterval(initializeUsers, 10 * 60 * 60 * 1000); // Refresh users every 10 hours
}
