import app from "./api/v1/app.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const port = process.env.PORT || 5000;
const host = process.env.HOST || "0.0.0.0";

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit the process
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    // Don't exit the process
});

app.listen(port, host, () => {
    console.log(`Server is running on ${host}:${port}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
});