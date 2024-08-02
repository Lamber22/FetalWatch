import express from "express";
import dbClient from "./config/db.js";

const app = express();

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from FetalWatch API" });
});

export default app;