import express from "express";
import { PORT, SERVER_URL } from "./utils/env.js";
import { whatsapp } from "./wwjs/config.js";
import log from "./utils/log.js";
import wwjs from "whatsapp-web.js";
const { MessageMedia } = wwjs;
import cors from "cors";
import { users } from "./firebase/startListeningToOffers.js";
import { gemini } from "./gemini/gemini.js";
import { db } from "./firebase/admin.js";

const app = express();
app.use(cors("*"));
app.use(express.json());
whatsapp.initialize();

app.get("/", (req, res) => {
  res.sendFile("pages/login.html", { root: "." });
});

app.get("/image", (req, res) => {
  res.sendFile("data/ogImage.jpeg", { root: "." });
});

app.post("/send-message", async (req, res) => {
  //   const { offer } = req.body;
  //   // Validate request body
  //   if (!offer) {
  //     return res.status(400).send("Offer not found");
  //   }
  //   res.status(200).send("Offer received");
  //   let media;
  //   // Fetch media from the offer or fallback to default
  //   try {
  //     media = await MessageMedia.fromUrl(offer.dishImage, { unsafeMime: true });
  //   } catch (error) {
  //     console.error("Failed to fetch media from URL:", error);
  //     try {
  //       media = await MessageMedia.fromUrl(`${SERVER_URL}/image`, {
  //         unsafeMime: true,
  //       });
  //     } catch (fallbackError) {
  //       console.error("Failed to fetch fallback media:", fallbackError);
  //       return; // Exit if no media is available
  //     }
  //   }
  //   const now = new Date();
  //   const currentHour = now.getHours();
  //   // Ensure messages are sent only after 8 PM and within 1 minute of offer creation
  //   const isAfter8PM = currentHour >= 20;
  //   const isRecentOffer =
  //     Date.now() - new Date(offer.createdAt).getTime() <= 60000;
  //   if (!isAfter8PM || !isRecentOffer) {
  //     console.log("Message not sent: Conditions not met");
  //     return;
  //   }
  //   // Calculate discount percentage
  //   const discountPercentage = Math.round(
  //     ((offer.originalPrice - offer.newPrice) / offer.originalPrice) * 100
  //   );
  //   // Default alert message
  //   let alertMsg = "🎉 New FoodieOffer Alert! 🎉";
  //   const message = `
  // *${offer.dishName}*
  // *Price: ₹${offer.newPrice}*
  // *Discount: ${discountPercentage}%*
  // Check out our latest offer: https://cravings.live/offers/${offer.id}/
  // Hurry, don't miss out! 🏃‍♂️💨`;
  //   // Generate an AI-based alert message
  //   try {
  //     const response = await gemini.generateContent(
  //       `Generate a funny and attractive single-sentence message with emojis for the following offer:
  //       Dish: ${offer.dishName}, Old Price: ₹${offer.originalPrice}, New Price: ₹${offer.newPrice}, Discount: ${discountPercentage}%`
  //     );
  //     const aiMessage = await response.response.text();
  //     if (aiMessage) {
  //       alertMsg = aiMessage;
  //     }
  //   } catch (error) {
  //     console.error("Failed to generate AI message:", error);
  //   }
  //   const combinedMessage = `${alertMsg}\n${message}`;
  //   // Send message to all users
  //   for (const user of users) {
  //     try {
  //       await whatsapp.sendMessage(user, combinedMessage, { media });
  //       console.log(`Message sent to ${user}`);
  //     } catch (error) {
  //       log(`Failed to send offer to ${user}:`, error);
  //     }
  //   }
});

app.post("/whatsapp-to-user", async (req, res) => {
  const { to, messageType , from } = req.body;

  // Validate request body
  if (!to || !messageType || !from) {
    return res.status(400).send("User or messageType or from not found");
  }

  res.status(200).send("Message sending initiated!");

  let userPhone;

  try {
    const userDoc = await db.doc("users/" + to).get();
    if (!userDoc.exists) {
      return res.status(404).send("User not found");
    }
    userPhone = userDoc.data().phone;
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error retrieving user data");
  }

  let userFormattedPhone;

  const trimmedPhone = userPhone?.replace(/^(\+91|0)/, "").replace(/\s+/g, "");
  if (trimmedPhone) {
    userFormattedPhone = `91${trimmedPhone}@c.us`;
  } else {
    return res.status(400).send("Invalid phone number");
  }

  let message = "";

  switch (messageType) {
    case "invite-reward":
      message =
        `🎉 Congratulations! You’ve earned *₹50 Cravings Cash* 💰 for inviting your friend *${from}*  🤝. Keep sharing and keep earning! 🚀`;
      break;
    default:
      message =
        "🍽️ Thank you for using Cravings! 🥳 Stay tuned for more rewards 🎁 and exciting offers 🏷️.";
  }

  try {
    await whatsapp.sendMessage(userFormattedPhone, message);
    console.log(`Message sent to ${userFormattedPhone}`);
  } catch (error) {
    log(`Failed to send message to ${userFormattedPhone}:`, error);
  }
});

app.listen(PORT, () => {
  log(`Server is running on port ${PORT}`);
});
