import express from "express";
import { PORT } from "./utils/env.js";
import { whatsapp } from "./wwjs/config.js";
import log from "./utils/log.js";

const app = express();
whatsapp.initialize();

app.get("/", (req, res) => {
  res.sendFile("pages/login.html", { root: "." });
});

app.listen(PORT, () => {
  log(`Server is running on port ${PORT}`);
});

