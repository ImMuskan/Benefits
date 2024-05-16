const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Username is required"],
    },
    
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    }
  })

module.exports = {
  Admin: mongoose.model("Admin", adminSchema),
};