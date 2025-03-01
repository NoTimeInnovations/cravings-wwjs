import express from "express";
import { PORT, SERVER_URL } from "./utils/env.js";
import { whatsapp } from "./wwjs/config.js";
import log from "./utils/log.js";
import wwjs from "whatsapp-web.js";
const { MessageMedia } = wwjs;
import cors from "cors";
import { db } from "./firebase/admin.js";
import cron from "node-cron";
import { deleteInactiveAccounts } from "./firebase/deleteInactiveAccount.js";

const app = express();
app.use(cors("*"));
app.use(express.json());
// whatsapp.initialize();

cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled account deletion check...");
  deleteInactiveAccounts();
});


app.get("/", (req, res) => {
  res.sendFile("pages/login.html", { root: "." });
});

app.get("/image", (req, res) => {
  res.sendFile("data/ogImage.jpeg", { root: "." });
});

app.post("/offerAlert", async (req, res) => {
    const { offer , hotel } = req.body;

    const followers = hotel?.followers;
    const followersNumFormated = followers?.map(follower => {
      let phone = follower?.phone;
      let phoneFormatted = `91${phone.replace(/^(\+91|0)/, "").replace(/\s+/g, "")}@c.us`;
      return phoneFormatted;
    })

    console.log(followersNumFormated);

    const discountPercentage = Math.round(((offer?.originalPrice - offer?.newPrice) / offer?.originalPrice) * 100);
    const offerCaption = `🎉 *${hotel?.hotelName}* is offering *${offer?.dishName}* at a special price of *₹${offer?.newPrice}* (Original Price: *₹${offer?.originalPrice}*)! 🏷️ Enjoy a discount of *${discountPercentage}%* off! 🌟 Don't miss out on this amazing offer from *Cravings*! 🍽️✨`;
    
    const media = await MessageMedia.fromUrl(offer?.dishImage, { unsafeMime: true });
    
    followersNumFormated.forEach(async (phone) => {
      try {
        await whatsapp.sendMessage(phone,  offerCaption, { media });
      } catch (error) {
        console.error(`Failed to send message to ${phone}:`, error);
      }
    });

    res.status(200).send("Message sending initiated!");
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
