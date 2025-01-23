import wwjs from "whatsapp-web.js";
const { MessageMedia } = wwjs;
import { sendMessage, whatsapp } from "../wwjs/config.js";
import { fcm, db } from "./admin.js";
import { users } from "./startListeningToOffers.js";

const watchCollectionForChanges = async () => {
  const collection = db.collection("offers");

  collection.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const doc = change.doc;

        if (doc.exists) {
          const offerData = doc.data();
          const isRecentOffer =
            Date.now() - new Date(offerData.createdAt).getTime() <= 60000;
          const dataUrlregex = /^data:image\/\w+;base64,/;

          if (isRecentOffer) {
            let imageUrl = offerData.dishImage;

            console.log(offerData.dishImage);
            console.log(dataUrlregex.test(offerData.dishImage));

            if (
              offerData.dishImage &&
              !dataUrlregex.test(offerData.dishImage)
            ) {
              imageUrl = offerData.dishImage;
            } else {
              imageUrl = undefined;
            }

            const message = {
              topic: "offers",
              notification: {
                title: "New Offer: " + offerData.dishName,
                body:
                  "Check out the new offer from " +
                  offerData.hotelName +
                  "! Discount: " +
                  offerData.newPrice,
                imageUrl: imageUrl,
              },
              android: {
                notification: {
                  imageUrl: imageUrl,
                  icon: "ic_stat_logo",
                  color: "#EA580C",
                  priority: "high",
                },
              },
            };

            console.log(message);

            fcm
              .send(message)
              .then((response) => {
                console.log("Notification sent successfully:", response);
              })
              .catch((error) => {
                console.error("Error sending notification:", error);
                sendMessage(
                  "Error sending notification: " + offerData.dishName
                );
              });

            sendMessageOnWhatsapp({
              id : doc.id,
              ...offerData
            });
          }
        } else {
          console.log("No such document!");
        }
      }
    });
  });
};

const sendMessageOnWhatsapp = async (offer) => {
    let media;

    // Fetch media from the offer or fallback to default
    try {
      media = await MessageMedia.fromUrl(offer.dishImage, { unsafeMime: true });
    } catch (error) {
      console.error("Failed to fetch media from URL:", error);
      try {
        media = await MessageMedia.fromUrl(`${SERVER_URL}/image`, {
          unsafeMime: true,
        });
      } catch (fallbackError) {
        console.error("Failed to fetch fallback media:", fallbackError);
        return; // Exit if no media is available
      }
    }

    // Calculate discount percentage
    const discountPercentage = Math.round(
      ((offer.originalPrice - offer.newPrice) / offer.originalPrice) * 100
    );

    // Default alert message
    let alertMsg = "🎉 New FoodieOffer Alert! 🎉";
    const message = `
  *${offer.dishName}*
  *Price: ₹${offer.newPrice}*
  *Discount: ${discountPercentage}%*
  
  Check out our latest offer: https://cravings.live/offers/${offer.id}/
  
  Hurry, don't miss out! 🏃‍♂️💨`;

    // Generate an AI-based alert message
    try {
      const response = await gemini.generateContent(
        `Generate a funny and attractive single-sentence message with emojis for the following offer:
        Dish: ${offer.dishName}, Old Price: ₹${offer.originalPrice}, New Price: ₹${offer.newPrice}, Discount: ${discountPercentage}%`
      );

      const aiMessage = await response.response.text();
      if (aiMessage) {
        alertMsg = aiMessage;
      }
    } catch (error) {
      console.error("Failed to generate AI message:", error);
    }

    const combinedMessage = `${alertMsg}\n${message}`;

    // Send message to all users
    for (const user of users) {
      try {
        await whatsapp.sendMessage(user, combinedMessage, { media });
        console.log(`Message sent to ${user}`);
      } catch (error) {
        log(`Failed to send offer to ${user}:`, error);
      }
    }
};

export { watchCollectionForChanges };
