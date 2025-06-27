const mongoose = require("mongoose");
const fileSchema = require("./file.js");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  files: [fileSchema], // Embed the fileSchema as an array
  printType: {
    type: String,
    enum: ["Black & White", "Color"],
    required: true,
  },
  copies: {
    type: Number,
    default: 1,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: String,
    enum: ["Online", "Cash", "Coins"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Processing", "Ready", "Completed", "Pending"],
    default: "Pending",
  },
  sides: {
    type: String,
    required : true,
  },
  paperSize: {
    type: String,
    required : true,
  },
  totalPages: {
    type: Number,
    required : true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
   owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
