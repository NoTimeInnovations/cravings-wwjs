import { fcm } from "./admin.js";

export async function sendAppNotification() {
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
      sendMessage("Error sending notification: " + offerData.dishName);
    });
}
