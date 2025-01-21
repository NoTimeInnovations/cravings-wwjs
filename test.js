import wwcli from "whatsapp-web.js";
import { whatsapp } from "./wwjs/config.js";
const { MessageMedia } = wwcli;

export const sendToUsers = async(msg , extra) => {
    try {
        
        let users = extra;
        users = users.split(" ");
        users = users.map((user) => `91${user}@c.us`);

        const message = "https://www.cravings.live"

        const audioFile = './data/audio.ogg';

        const media = MessageMedia.fromFilePath(audioFile);


        for (const user of users) {
            try {
                await whatsapp.sendMessage(user, message, { media });
                await whatsapp.sendMessage(user, message);
                await whatsapp.sendMessage(msg.from, "Message sent to " + user);
            } catch (error) {
                console.error(`Failed to send message to ${user}:`, error);
                await whatsapp.sendMessage(msg.from, `Failed to send message to ${user}: ${error}`);
            }
        }

    } catch (error) {
        
        console.error("Failed to send message to users:", error);

    }
}