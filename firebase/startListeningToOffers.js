import wwjs from "whatsapp-web.js";
import { ENV } from "../utils/env.js";
import { whatsapp } from "../wwjs/config.js";
import { rtdb } from "./admin.js";
import { getUserPhone } from "./getUserPhone.js";
import log from "../utils/log.js";

const { MessageMedia } = wwjs;

// Define users outside to avoid duplication
let users = [];
let imageUrl;

async function initializeUsers() {
  if (ENV === "dev") {
    users = ["916282826684@c.us", "919809873068@c.us", "919447156765@c.us"];
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

  if (hours === 8 && minutes === 0 && seconds === 0) {
    message =
      "🌅 Good Morning! 🌅\n\nExciting new offers are available this morning! 🌟\nCheck them out now at https://www.cravings.live 🍽️";
  } else if (hours === 12 && minutes === 0 && seconds === 0) {
    message =
      "🌞 Good Afternoon! 🌞\n\nAmazing new offers are available this noon! 🌟\nDon't miss out, check them out at https://www.cravings.live 🍽️";
  } else if (hours === 16 && minutes === 0 && seconds === 0) {
    message =
      "🌇 Good Evening! 🌇\n\nUnwind with our special evening offers! 🌟\nDiscover them now at https://www.cravings.live 🍽️";
  } else {
    return;
  }

  const media = await MessageMedia.fromUrl(imageUrl, { unsafeMime: true });

  for (const user of users) {
    try {
      await whatsapp.sendMessage(user, message, { media });
    } catch (error) {
      log(
        "Failed to send scheduled message to " + user + "\n\n" + error
      );
    }
  }
}

export function startScheduledMessages() {
  startListeningToOffers();
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
    imageUrl = offer.dishImage;

    const media = await MessageMedia.fromUrl(imageUrl, { unsafeMime: true });

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
          await whatsapp.sendMessage(user, message , { media });
        } catch (error) {
          log(
            "Failed to send offer link to " + user + "\n\n" + error
          );
        }
      }
    }
  });
}
