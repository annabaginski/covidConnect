const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    acquisitionCase: {
        type: String,
        require: false,
    },
    acquisition1: {
        type: String,
        require: false,
    },
    acquisition2: {
        type: String,
        require: false,
    },
    contact1: {
        type: String,
        require: true,
    },
    contact1Tel: {
        type: String,
        require: true,
    },
    contact2: {
        type: String,
        require: true,
    },
    contact2Tel: {
        type: String,
        require: true,
    },
    contact3: {
        type: String,
        require: true,
    },
    contact3Tel: {
        type: String,
        require: true,
    },
    contact4: {
        type: String,
        require: true,
    },
    contact4Tel: {
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

module.exports = mongoose.model("Contact", ContactSchema);
