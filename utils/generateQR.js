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

  await writeQRToFile(`<img src="${qrUrl}" alt="QR Code">`);

  log(qrUrl);
}

async function writeQRToFile(body) {
  const now = new Date();
  const lastUpdated = now.toLocaleString();
  fs.openSync("pages/login.html", "w");
  fs.writeFileSync(
    "pages/login.html",
    `<html><head><script> setInterval(()=>{ window.location.reload() } ,500); </script></head><body>${body}<p>Last updated: ${lastUpdated}</p></body></html>`
  );
}

export { generateQR, writeQRToFile };
