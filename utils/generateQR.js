import { ENV } from "./env.js";
import qrcode from "qrcode-terminal";
import log from "./log.js";

function generateQR(qr) {

  if (ENV === "dev") {
    qrcode.generate(qr, { small: true });
  }

  const encodedQR = encodeURIComponent(qr);

  log(
    `https://api.qrserver.com/v1/create-qr-code/?data=${encodedQR}&size=500x500`
  );

}

export default generateQR;