import { sendMessage, whatsapp } from "../wwjs/config.js";
import fs from 'fs';
import path from 'path';


function test(){
  sendMessage("This is a test message");
}

function log(){
  const filePath = path.resolve('data/log.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    sendMessage(data);
  });
}


function clearLog(){
  const filePath = path.resolve('data/log.txt');
  fs.writeFile(filePath, '', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    sendMessage("Log cleared!");
  });
}

const commandConfig = {
  "#test": test,
  "#log": log,
  "#clearLog" : clearLog
};

export default commandConfig;
