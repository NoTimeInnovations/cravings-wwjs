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

          if (isRecentOffer) {
            const message = {
              topic: "offers",
              notification: {
                title: "New Offer: " + offerData.dishName,
                body:
                  "Check out the new offer from " +
                  offerData.hotelName +
                  "! Discount: " +
                  offerData.newPrice,
                imageUrl: offerData.dishImage,
              },
            };

            fcm
              .send(message)
              .then((response) => {
                console.log("Notification sent successfully:", response);
              })
              .catch((error) => {
                console.error("Error sending notification:", error);
              });
          }
        } else {
          console.log("No such document!");
        }
      }
    });
  });
};

export { watchCollectionForChanges };
