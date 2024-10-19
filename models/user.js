const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    joinType: String,
    userId: String,
    password: String,
    userName: String,
    phone: String,
    phone1: String,
    phone2: String,
    phone3: String,
    email: String,
    birth: String,
    birthYear: String,
    birthMonth: String,
    birthDay: String,
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
    orderHistory: [],
    recentView: [],
    wishList: [],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
