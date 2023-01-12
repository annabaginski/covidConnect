const mongoose = require("mongoose");

const IntakeSchema = new mongoose.Schema({
    fullName: {
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
    enddate: {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Intake", IntakeSchema);
