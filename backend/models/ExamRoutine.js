const mongoose = require("mongoose");

const examRoutineSchema = new mongoose.Schema(
  {
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
    },
  },
  { timestamps: true, collection: "exam_routines" },
);

module.exports = mongoose.model("ExamRoutine", examRoutineSchema);
