import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB = process.env.DB_URI;

class DBClient {
    constructor() {
        this.connectDB();
    }

    async connectDB() {
        try {
            if (!DB) {
                throw new Error("Database URI is not defined in environment variables");
            }
            
            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            };

            await mongoose.connect(DB, options);
            console.log("Database connected successfully!!!");
        } catch (error) {
            console.error("Error connecting to the database:", error);
            console.log("Retrying connection in 5 seconds...");
            setTimeout(() => this.connectDB(), 5000);
        }
    }
}

// Handle connection events
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    setTimeout(() => new DBClient().connectDB(), 5000);
});

const dbClient = new DBClient();

export default dbClient;