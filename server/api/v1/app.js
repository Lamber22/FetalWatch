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
import maternalRouter from "./routes/maternalRoute.js";
import riskAssessmentRouter from "./routes/riskAssessmentRoutes.js";
import deliveryRouter from "./routes/deliveryRoute.js";
import postnatalRouter from "./routes/postnatalRoutes.js";
import reportRouter from "./routes/reportRoute.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: '*', // Allow all origins for testing purposes
}));

app.get("/api/v1/", (req, res) => {
    res.status(200).json({ message: "Hello from FetalWatch API" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/patients", patientRouter);
app.use("/api/v1/pregnancies", pregancyRouter);
app.use("/api/v1/aiResults", airouter);
app.use("/api/v1/labResults", labResultRouter);
app.use("/api/v1/fetalwatch", fetalRouter);
app.use("/api/v1/maternal", maternalRouter);
app.use("/api/v1/risk-assessment", riskAssessmentRouter);
app.use("/api/v1/delivery", deliveryRouter);
app.use("/api/v1/postnatal", postnatalRouter);
app.use("/api/v1/reports", reportRouter);

export default app;