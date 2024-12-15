import { sendMessage } from "../wwjs/config.js";

function test(){
  sendMessage("This is a test message");
}

const commandConfig = {
  "#test": test
};

export default commandConfig;
