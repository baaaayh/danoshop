const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    joinType: String,
    userId: String,
    password: String,
    userName: String,
    phone: String,
    email: String,
    birth: String,
    recommand: String,
    cart: [
        {
            id: String,
            options: Array,
            price: String,
            data: Object,
        },
    ],
    connectionTime: Number,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
