import app from "./api/v1/app.js";

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 5000;

app.listen(port, host, () => {
    console.log(`Server is running on port ${port} on ${host}`);
});