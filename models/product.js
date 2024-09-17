const mongoose = require("mongoose");

// Define the KV schema
const MainProductSchema = new mongoose.Schema({
    id: String,
    thumb: String,
    view: String,
    detail: String,
    type: String,
});

// Create the KV model
const MainProduct = mongoose.model("MainProduct", MainProductSchema);

// Export the model
module.exports = MainProduct;
