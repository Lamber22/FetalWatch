import express from "express";

const app = express();
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from FetalWatch server" })
});

app.listen(port, host, () => {
    console.log(`Server is running on port ${port} on ${host}`);
});