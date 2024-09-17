const mongoose = require("mongoose");

// Define the KV schema
const KVSchema = new mongoose.Schema({
    id: String,
    image: String,
});

// Create the KV model
const KV = mongoose.model("kv", KVSchema);

// Export the model
module.exports = KV;
