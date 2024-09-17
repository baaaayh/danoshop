require("dotenv").config(); // Load environment variables

const mongoose = require("mongoose");

module.exports = () => {
    function connect() {
        const uri = process.env.MONGODB_URI; // Use environment variable
        if (!uri) {
            console.error("MongoDB URI is not defined");
            return;
        }

        mongoose
            .connect(uri)
            .then(() => {
                console.log("MongoDB connected");
            })
            .catch((err) => {
                console.error("MongoDB connection error:", err);
            });
    }

    connect();

    mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected. Attempting to reconnect...");
        connect();
    });
};
