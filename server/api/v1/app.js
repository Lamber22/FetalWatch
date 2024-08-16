import express from "express";
import morgan from "morgan";
import cors from "cors";
import dbClient from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import patientRouter from "./routes/patientRoute.js";
import pregancyRouter from "./routes/pregnancyRoute.js";
import airouter from "./routes/aiRoute.js";
import labResultRouter from "./routes/labResultRoute.js";
import fetalRouter from "./routes/fetalRoute.js";

const app = express();

// Middleware for parsing JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from FetalWatch API" });
});
app.use(morgan("dev"));
app.use(cors());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/pregnancies", pregancyRouter);
app.use("/api/v1/aiResults", airouter);
app.use("/api/v1/labResults", labResultRouter);
app.use("/api/v1/fetalwatch", fetalRouter);

export default app;