import express from "express";
import { PORT } from "./utils/env.js";
import { whatsapp } from "./wwjs/config.js";

const app = express();
whatsapp.initialize();

app.get("/", (req, res) => {
  res.sendFile("pages/login.html", { root: "." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

