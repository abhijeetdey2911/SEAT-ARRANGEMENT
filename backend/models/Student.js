const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    department: {
      type: String,
      required: true,
      enum: ["CSE", "IT", "ME", "ECE"],
    },

    exam: {
      type: String,
      required: true,
    },

    // 👉 Seat info
    seatNumber: {
      type: Number,
      default: null,
    },

    benchNumber: {
      type: Number,
      default: null,
    },

    seatPosition: {
      type: String,
      enum: ["left", "right"],
      default: null,
    },

    // 👉 Classroom info
    classroom: {
      type: String,
      default: null,
    },

    examTime: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Student", studentSchema);