const mongoose = require("mongoose");

const CheckinSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true,
    },
    dob: {
        type: Date,
        require: true,
    },
    phone: {
        type: Number,
        require: false,
    },
    prefcont: {
        type: String,
        require: true,
    },
    startdate: {
        type: Date,
        require: true,
    },
    cough: {
        type: String,
        require: true,
    },
    soreThroat: {
        type: String,
        require: true,
    },
    sob: {
        type: String,
        require: true,
    },
    fever: {
        type: String,
        require: true,
    },
    loss: {
        type: String,
        require: true,
    },
    user: {
        type: String,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Checkin", CheckinSchema);
