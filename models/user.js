const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: String,
    password: String,
    cart: [
        {
            id: String,
            options: Array,
            price: String,
            data: Object,
        },
    ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
