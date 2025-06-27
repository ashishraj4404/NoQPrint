const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pricingSchema = new Schema({
    bwA4: {
      type: Number,
      required: true,
      default: 5,
    },
    bwA3: {
      type: Number,
      required: true,
      default: 8,
    },
    colorA4: {
      type: Number,
      required: true,
      default: 10,
    },
    colorA3: {
      type: Number,
      required: true,
      default: 15,
    },
    doubleSidedDiscount: {
      type: Number,
      required: true,
      default: 2,
    }

});

module.exports = mongoose.model("Pricing", pricingSchema);