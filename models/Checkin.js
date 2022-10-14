const mongoose = require("mongoose");

const CheckinSchema = new mongoose.Schema({
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
