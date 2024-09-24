const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: String,
    password: String,
    cart: [
        {
            id: String,
            options: Array,
            price: String,
            data: {
                id: String,
                thumb: String,
                view: String,
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
            },
        },
    ],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
