const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    menu: [
        {
            depth1: String,
            category: String,
            depth2: Array,
        },
    ],
});

const MENU = mongoose.model('MENU', MenuSchema);

module.exports = MENU;
