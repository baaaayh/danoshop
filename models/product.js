const mongoose = require('mongoose');

const MainProductSchema = new mongoose.Schema({
    id: String,
    thumb: String,
    view: String,
    detail: String,
    type: String,
});

const MainProduct = mongoose.model('MainProduct', MainProductSchema);

module.exports = MainProduct;
