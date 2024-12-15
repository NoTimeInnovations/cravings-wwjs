import express from "express";
import { PORT } from "./utils/env.js";
import { whatsapp } from "./wwjs/config.js";
import puppeteer from "puppeteer-core";
const chromiumPath = "/usr/bin/chromium-browser";

const app = express();

puppeteer
  .launch({
    executablePath: chromiumPath,
    headless: true, 
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })
  .then((browser) => {
    console.log("Browser launched");
    whatsapp.initialize();
  });

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
