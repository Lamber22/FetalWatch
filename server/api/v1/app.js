import express from "express";
import dbClient from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import patientRouter from "./routes/patientRoute.js";
import pregancyRouter from "./routes/pregnancyRoute.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from FetalWatch API" });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/pregnancies", pregancyRouter);

export default app;