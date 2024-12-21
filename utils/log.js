import fs from 'fs';
import path from 'path';

export default function log(...msgs) {
    const logFilePath = path.join('data/log.txt');
    const message = msgs.join(' ');
    const now = new Date();
    const timestamp = now.toLocaleString();
    const logMessage = `*[${timestamp}:]* ${message}`;

    fs.appendFileSync(logFilePath, logMessage + '\n', 'utf8');
    console.log(message);
    
}
