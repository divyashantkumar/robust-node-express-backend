import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 5000; // 5 seconds
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;

class DatabaseConnnection {
    constructor() {
        this.retryAttempts = 0;
        this.isConnected = false;

        // configure mogoose settings
        mongoose.set("strictQuery", true);

        mongoose.connection.on("connected", () => {
            console.log("✅ Mongoose is connected");
            this.isConnected = true;
        });

        mongoose.connection.on("error", (error) => {
            console.log("❌ Mongoose connection error: ", error);
            this.isConnected = false;
        });

        mongoose.connection.on("disconnected", () => {
            console.log("⚠️ Mongoose is disconnected");
            this.isConnected = false;

            // Attempt to reconnect
            this.handleDisconnection();
        });

        // Handle application termination
        process.on('SIGINT', this.handleAppTermination.bind(this));
        process.on('SIGTERM', this.handleAppTermination.bind(this));
    }

    async connect() {
        try {
            if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined in .env file");

            const connectionOptions = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                maxPoolSize: 10, // in free tier 10 is supported
                serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
                socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
                family: 4, // use IPv4, skip trying IPv6
            }

            if (NODE_ENV == "development") {
                mongoose.set("debug", true);
            }

            await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`, connectionOptions);
            this.retryAttempts = 0; // Reset retry attempts on successful connection
        } catch (error) {
            console.error("❌ Mongoose connection error: ", error);
            await this.handleConnectionError();
        }
    }

    async handleConnectionError() {
        if (this.retryAttempts < MAX_RETRY_ATTEMPTS) {
            this.retryAttempts++;
            console.log(`Retrying connection attempt ${this.retryAttempts} of ${MAX_RETRY_ATTEMPTS} in ${RETRY_DELAY / 1000}seconds...`);
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, RETRY_DELAY)
            });

            return this.connect();
        } else {
            console.error("❌ Mongoose connection error: Max retry attempts reached");
            process.exit(1);
        }
    }

    async handleDisconnection() {
        if (!this.isConnected) {
            console.log("⚠️ Mongoose is disconnected. Attempting to reconnect...");
            await this.connect();
        }
    }

    async handleAppTermination() {
        try {
            // Close the Mongoose connection to make sure that all the pool connections are closed
            await mongoose.connection.close();

            console.log("MongoDB connection closed through app termination");
            process.exit(0);
        } catch (error) {
            console.error("❌ Mongoose disconnection error: ", error);
            process.exit(1);
        }
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name
        };
    }
}


// Create a singleton instance of DatabaseConnnection
const databaseConnnection = new DatabaseConnnection();

export default databaseConnnection.connect.bind(databaseConnnection);
export const getDBStatus = databaseConnnection.getConnectionStatus.bind(databaseConnnection);