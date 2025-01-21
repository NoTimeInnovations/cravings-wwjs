import { whatsapp } from "./wwjs/config.js";

export async function addLabel() {
  try {
    const users = await whatsapp.getChats();
    const userIds = users.map((user) => user.id._serialized);
    await whatsapp.addOrRemoveLabels([1], userIds, true);
  } catch (error) {
    console.error("Failed to add label:", error);
  }
}

