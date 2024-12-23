import express from "express";
import { PORT } from "./utils/env.js";
import { whatsapp } from "./wwjs/config.js";
import log from "./utils/log.js";
import wwjs from "whatsapp-web.js";
const { MessageMedia } = wwjs;

const app = express();
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

  // const media = await MessageMedia.fromUrl(imageUrl, { unsafeMime: true });

  // // Ensure messages are only sent after 8 PM
  // if (
  //   hours >= 20 &&
  //   Date.now() - new Date(offer.createdAt).getTime() <= 60000
  // ) {
  //   log("Sending offer message to users");

  //   let message;
  //   if (offer.category === "supermarket") {
  //     message = `🛒 New CraveMart Offer! 🛒\n\nProduct: ${offer.dishName}\nPrice: ${offer.newPrice}\n\nCheck out our latest offer: https://cravings.live/offers/${snapshot.key}/\n\nHurry, don't miss out! 🏃‍♂️💨`;
  //   } else {
  //     message = `🎉 New FoodieOffer Alert! 🎉\n\nDish: ${offer.dishName}\nPrice: ${offer.newPrice}\n\nCheck out our latest offer: https://cravings.live/offers/${snapshot.key}/\n\nHurry, don't miss out! 🏃‍♂️💨`;
  //   }

  //   for (const user of users) {
  //     try {
  //       await whatsapp.sendMessage(user, message, { media });
  //     } catch (error) {
  //       log("Failed to send offer link to " + user + "\n\n" + error);
  //     }
  //   }
  // }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  log(`Server is running on port ${PORT}`);
});
