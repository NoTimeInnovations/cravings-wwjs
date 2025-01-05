import { sendMessage } from "../wwjs/config.js";
import { fcm, db } from "./admin.js";

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
          }
        } else {
          console.log("No such document!");
        }
      }
    });
  });
};

watchCollectionForChanges();

export { watchCollectionForChanges };
