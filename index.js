import express, { response } from "express";
import { PORT } from "./utils/env.js";
import { whatsapp } from "./wwjs/config.js";
import log from "./utils/log.js";
import wwjs from "whatsapp-web.js";
const { MessageMedia } = wwjs;
import cors from "cors";
import { users } from "./firebase/startListeningToOffers.js";
import { gemini } from "./gemini/gemini.js";

const app = express();
app.use(cors("*"));
app.use(express.json());
whatsapp.initialize();

app.get("/", (req, res) => {
  res.sendFile("pages/login.html", { root: "." });
});

app.post("/send-message", async (req, res) => {
  const { offer } = req.body;

  if (!offer) {
    return res.status(400).send("Offer not found");
  }

  res.status(200).send("got the offer");

  const media = await MessageMedia.fromUrl(offer.dishImage, {
    unsafeMime: true,
  });

  const now = new Date();
  const hours = now.getHours();
  // Ensure messages are only sent after 8 PM
  if (
    hours >= 20 &&
    Date.now() - new Date(offer.createdAt).getTime() <= 60000
  ) {
    const discountPercentage = Math.round(
      ((offer.originalPrice - offer.newPrice) / offer.originalPrice) * 100
    );

    let alertMsg = "🎉 New FoodieOffer Alert! 🎉";
    let message = `\n*${offer.dishName}*\n*Price: ₹${offer.newPrice}*\n*Discount: ${discountPercentage}%*\n\nCheck out our latest offer: https://cravings.live/offers/${offer.id}/\n\nHurry, don't miss out! 🏃‍♂️💨`;

    try {
      const response = await gemini.generateContent(
        "generate an message for a latest offer in single sentace include emojies and make it attractive it should be in funny way. offer dish :" +
          offer.dishName +
          "old price :" +
          offer.originalPrice +
          "new price : ₹" +
          offer.newPrice +
          "discount percentage" +
          discountPercentage
      );
      const data = await response.response.text();
      console.log(data);

      if (data) {
        alertMsg = data;
      }
    } catch (error) {
      console.error(error);
    }

    let combinedMsg = alertMsg + message;

    for (const user of users) {
      try {
        await whatsapp.sendMessage(user, combinedMsg, { media });
      } catch (error) {
        log("Failed to send offer link to " + user + "\n\n" + error);
      }
    }
  }
});

app.listen(PORT, () => {
  log(`Server is running on port ${PORT}`);
});
