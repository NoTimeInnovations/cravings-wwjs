import { whatsapp } from "../wwjs/config.js";
import { rtdb } from "./admin.js";
import { getUserPhone } from "./getUserPhone.js";

export async function startListeningToOffers() {
  const offersRef = rtdb.ref("offers");
  const users = await getUserPhone();

  for (const user of users) {
    try {
      await whatsapp.sendMessage(user, "Client is ready!");
    } catch (error) {
      console.error("Failed to send message to " + user + "\n\n" + error);
    }
  }

  offersRef.on("child_added", async (snapshot) => {
    const offer = snapshot.val();

    if (
      new Date(offer.toTime) > Date.now() &&
      Date.now() - new Date(offer.createdAt).getTime() <= 60000
    ) {
      const message = `https://cravings-nextjs.vercel.app/offers/${snapshot.key}/`;

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
