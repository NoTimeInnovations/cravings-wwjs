import { ENV } from "./env.js";
import qrcode from "qrcode-terminal";
import log from "./log.js";
import fs from "fs";

async function generateQR(qr) {
  if (ENV === "dev") {
    qrcode.generate(qr, { small: true });
  }

  const encodedQR = encodeURIComponent(qr);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodedQR}&size=500x500`;

  await writeQRToFile();

  async function writeQRToFile() {
    const now = new Date();
    const lastUpdated = now.toLocaleString();
    fs.truncateSync("pages/login.html", 0);
    fs.writeFileSync(
      "pages/login.html",
      `<html><body><img src="${qrUrl}" alt="QR Code"><p>Last updated: ${lastUpdated}</p></body></html>`
    );
  }

  log(qrUrl);
}

export default generateQR;
