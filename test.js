import wwcli from "whatsapp-web.js";
import { whatsapp } from "./wwjs/config.js";
const { MessageMedia } = wwcli;

export const sendToUsers = async() => {
    try {
        
        let users = '8089636843 9895204224 9946391005 9645963100 9544889849 8197929467 7025875445';
        users = users.split(" ");
        users = users.map((user) => `91${user}@c.us`);

        const message = "https://www.cravings.live"

        const audioFile = './data/audio.ogg';

        const media = MessageMedia.fromFilePath(audioFile);


        for (const user of users) {
            try {
                await whatsapp.sendMessage(user, message, { media });
                await whatsapp.sendMessage(user, message);
            } catch (error) {
                console.error(`Failed to send message to ${user}:`, error);
            }
        }

    } catch (error) {
        
        console.error("Failed to send message to users:", error);

    }
}