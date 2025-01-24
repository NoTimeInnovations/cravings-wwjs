import { db } from "./admin.js";

export async function deleteInactiveAccounts() {
    const now = Date.now();
    const usersRef = db.collection("users");
    const snapshot = await usersRef
      .where("accountStatus", "==", "inActive")
      .get();
  
    snapshot.forEach(async (doc) => {
      const userData = doc.data();
      const deletionRequestedAt = userData.deletionRequestedAt.toDate().getTime();
  
      // Check if 30 days have passed
      if (now - deletionRequestedAt >= 30 * 24 * 60 * 60 * 1000) {
        await doc.ref.delete(); // Delete the user document
        console.log(`Deleted account for user: ${doc.id}`);
      }
    });
  
    console.log("Scheduled account deletion check completed.");
  }
