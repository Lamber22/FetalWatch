import express from "express";
import dbClient from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from FetalWatch API" });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

export default app;