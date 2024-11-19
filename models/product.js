const mongoose = require("mongoose");

const MainProductSchema = new mongoose.Schema({
    id: String,
    thumb: String,
    view: String,
    detail: String,
    detail: String,
    type: String,
    mainExpose: String,
    title: String,
    price: String,
    config: String,
    category: String,
    deliveryCharge: String,
    deliveryType: String,
    options: Array,
    soldout: String,
    summary: String,
});

const MainProduct = mongoose.model("MainProduct", MainProductSchema);

module.exports = MainProduct;
