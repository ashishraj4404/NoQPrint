const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  clerkUserId: { 
    type: String,
    required: true, 
    unique: true 
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  coins : {
    type : Number,
    default : 0
  },
  role: {
    type : String,
    enum: ["admin", "user", "shopkeeper"],
    required: true
  }

});

module.exports = mongoose.model("User", userSchema);
