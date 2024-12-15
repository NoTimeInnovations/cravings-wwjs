import { db } from "./admin.js";

export async function getUserPhone() {
  try {
    const userSnapshot = await db.collection("users").where("role", "==", "user").where("phone", "!=", "").get();

    const users = userSnapshot.docs.map(doc => doc.data());
    const userPhones = users.map(user => {
      const trimmedPhone = user?.phone?.replace(/^(\+91|0)/, '');
      if (trimmedPhone) return `91${trimmedPhone}@c.us`;
    });

    console.log(userPhones);
    
    return ['919447156765@c.us'];
    
  } catch (error) {
    console.error("Failed to get user phone\n\n" + error);
  }
}
