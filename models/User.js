const mongoose = require("mongoose");

const benefitsSchema = new mongoose.Schema(
  {
    benefit_name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Benefit name is required"],
    },
    description: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Description is required"],
    },
    elegibility_criteria: {
      type: String,
      trim: true,
      required: [true, "elegibility_criteria is required"],
    },
    coverage_amount: {
      type: String,
      trim: true,
      required: [true, "coverage_amount is required"],
    },
    image: {
      type: String,
      trim: true,
      required: [true, "image is required"],
    }
  })
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email is required"],
    },
    role: {
      type: String,
      trim: true,
      required: [true, "Role is required"],
    },
    age: {
      type: String,
      trim: true,
      required: [true, "Age is required"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },
    added_benefits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Benefits'
      }
    ],
  })

module.exports = {
  User: mongoose.model("User", userSchema),
  Benefits: mongoose.model("Benefits", benefitsSchema)
};