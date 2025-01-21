import log from "../utils/log.js";
import { db } from "./admin.js";
import { whatsapp } from "../wwjs/config.js";
import { ADMINS } from "../utils/env.js";

export async function getUserPhone() {
  try {
    const userSnapshot = await db
      .collection("users")
      .where("role", "==", "user")
      .where("phone", "!=", "")
      .get();

    const ADMINS = await getAdmins();
    const users = userSnapshot.docs.map((doc) => doc.data());
    var userPhones = users
      .map((user) => {
        const trimmedPhone = user?.phone
          ?.replace(/^(\+91|0)/, "")
          .replace(/\s+/g, "");
        if (trimmedPhone) return `91${trimmedPhone}@c.us`;
      })
      .filter(Boolean);

    var userPhones = [...ADMINS, ...userPhones];

    const uniqueUserPhones = [...new Set(userPhones)];

    return uniqueUserPhones;
  } catch (error) {
    log("Failed to get user phone\n\n" + error);
  }
}

export async function getAdmins() {
  try {
    let users = await whatsapp.getChatsByLabelId("1");
    users = users.map((user) => user.id._serialized);
    console.log("Admins : ",users);
    return users;
  } catch (error) {
    console.error("Error fetching admins:", error);
    return ADMINS;
  }
}
