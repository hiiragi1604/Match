import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

app.get("/ping", (req, res) => {
  res.send("pong");
});

export default app;
