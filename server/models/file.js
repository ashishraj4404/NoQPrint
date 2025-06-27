const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['pdf', 'image'],
    required: true
  },
  pages : {
    type: Number,
    required: true
  },
}, { _id: false });

module.exports = fileSchema;