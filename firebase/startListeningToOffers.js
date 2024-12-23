import wwjs from "whatsapp-web.js";
import { ENV } from "../utils/env.js";
import { whatsapp } from "../wwjs/config.js";
import { rtdb } from "./admin.js";
import { getUserPhone } from "./getUserPhone.js";
import log from "../utils/log.js";
import { gemini } from "../gemini/gemini.js";
import { generateImageUrl } from "../utils/generateImage.js";

const { MessageMedia } = wwjs;

// Define users outside to avoid duplication
let users = [];
let imageUrl;

async function initializeUsers() {
  if (ENV === "dev") {
    users = ["916282826684@c.us"];
  } else {
    users = await getUserPhone();
  }
}

// Function to send scheduled messages at specific times
async function sendScheduledMessages() {
  if (users.length === 0) await initializeUsers();

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  let message = null;

  let aiMessage = null;

  if (!imageUrl) {
    imageUrl = generateImageUrl();
  }

  let commonPrompt =
    "it should be a short message with a call to action to visit the website and check out the offers. it should be attractive usign emojies message should be funny";

  if (hours === 8 && minutes === 0 && seconds === 0) {
    message =
      "🌅 Good Morning! 🌅\n\nExciting new offers are available this morning! 🌟\nCheck them out now at https://www.cravings.live 🍽️";
    aiMessage = await gemini.generateContent(
      "Create a morning offer message for our users at https://www.cravings.live" +
        commonPrompt
    );
  } else if (hours === 12 && minutes === 0 && seconds === 0) {
    message =
      "🌞 Good Afternoon! 🌞\n\nAmazing new offers are available this noon! 🌟\nDon't miss out, check them out at https://www.cravings.live 🍽️";
    aiMessage = await gemini.generateContent(
      "Create an afternoon offer message for our users at https://www.cravings.live" +
        commonPrompt
    );
  } else if (hours === 16 && minutes === 31 && seconds === 0) {
    message =
      "🌇 Good Evening! 🌇\n\nUnwind with our special evening offers! 🌟\nDiscover them now at https://www.cravings.live 🍽️";
    aiMessage = await gemini.generateContent(
      "Create an evening offer message for our users at https://www.cravings.live" +
        commonPrompt
    );
  } else {
    return;
  }

  console.log(aiMessage);

  const aiMessageResponse = aiMessage.response.text();

  if (aiMessageResponse) {
    message = aiMessageResponse;
  }

  console.log(message);

  const media = await MessageMedia.fromUrl(imageUrl, { unsafeMime: true });

  await whatsapp.sendMessage("916282826684@c.us" , message , { media });

  // for (const user of users) {
  //   try {
  //     await whatsapp.sendMessage(user, message, { media });
  //   } catch (error) {
  //     log("Failed to send scheduled message to " + user + "\n\n" + error);
  //   }
  // }
}

export function startScheduledMessages() {
  // startListeningToOffers();
  setInterval(sendScheduledMessages, 1000); // 1 second
  setInterval(initializeUsers, 10 * 60 * 60 * 1000); // 10 hours
}

// Function to listen to offer additions and send messages at 8 PM only
async function startListeningToOffers() {
  const offersRef = rtdb.ref("offers");

  offersRef.on("child_added", async (snapshot) => {
    const offer = snapshot.val();

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const currentTime = `${hours}:${minutes}:${seconds}`;
    const imgURl = offer.dishImage;

    const media = await MessageMedia.fromUrl(imgURl, { unsafeMime: true });

    // Ensure messages are only sent after 8 PM
    if (
      hours >= 20 &&
      Date.now() - new Date(offer.createdAt).getTime() <= 60000
    ) {
      log("Sending offer message to users");

      let message;
      if (offer.category === "supermarket") {
        message = `🛒 New CraveMart Offer! 🛒\n\nProduct: ${offer.dishName}\nPrice: ${offer.newPrice}\n\nCheck out our latest offer: https://cravings.live/offers/${snapshot.key}/\n\nHurry, don't miss out! 🏃‍♂️💨`;
      } else {
        message = `🎉 New FoodieOffer Alert! 🎉\n\nDish: ${offer.dishName}\nPrice: ${offer.newPrice}\n\nCheck out our latest offer: https://cravings.live/offers/${snapshot.key}/\n\nHurry, don't miss out! 🏃‍♂️💨`;
      }

      for (const user of users) {
        try {
          await whatsapp.sendMessage(user, message, { media });
        } catch (error) {
          log("Failed to send offer link to " + user + "\n\n" + error);
        }
      }
    }
  });
}
