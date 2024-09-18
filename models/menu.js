const mongoose = require("mongoose");

// Define the KV schema
const MenuSchema = new mongoose.Schema({
    menu: [
        {
            depth1: String,
            category: String,
            depth2: Array,
        },
    ],
});

// Create the KV model
const MENU = mongoose.model("MENU", MenuSchema);

// Export the model
module.exports = MENU;
