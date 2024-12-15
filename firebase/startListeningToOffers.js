import { ENV } from "../utils/env.js";
import { whatsapp } from "../wwjs/config.js";
import { rtdb } from "./admin.js";
import { getUserPhone } from "./getUserPhone.js";

export async function startListeningToOffers() {
  const offersRef = rtdb.ref("offers");

  let users = [];

  if (ENV === "dev") {
    users = ["916282826684@c.us", "919447156765@c.us", "919809873068@c.us"];
  } else {
    users = await getUserPhone();
  }

  offersRef.on("child_added", async (snapshot) => {
    const offer = snapshot.val();

    if (
      new Date(offer.toTime) > Date.now() &&
      Date.now() - new Date(offer.createdAt).getTime() <= 60000
    ) {
      const message = `https://cravings.live/offers/${snapshot.key}/`;

      for (const user of users) {
        try {
          await whatsapp.sendMessage(user, message);
        } catch (error) {
          console.error("Failed to send message to " + user + "\n\n" + error);
        }
      }
    }
  });
}
