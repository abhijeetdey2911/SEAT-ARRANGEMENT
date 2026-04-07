const mongoose = require("mongoose");

const seatingAssignmentSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    examDate: {
      type: String,
      required: true,
    },
    examTime: {
      type: String,
      required: true,
    },
    reportingTime: {
      type: String,
      default: "",
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    benchNumber: {
      type: Number,
      required: true,
    },
    seatNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, collection: "seating_assignments" },
);

seatingAssignmentSchema.index({ rollNumber: 1, subjectName: 1 }, { unique: true });

module.exports = mongoose.model("SeatingAssignment", seatingAssignmentSchema);
