const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const SeatingAssignment = require("../models/SeatingAssignment");

router.get("/", async (_req, res) => {
  try {
    const assignments = await SeatingAssignment.find().sort({ examDate: 1, seatNumber: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seating assignments" });
  }
});

router.get("/student/:rollNumber", async (req, res) => {
  try {
    const roll = req.params.rollNumber.trim();
    const assignments = await SeatingAssignment.find({
      rollNumber: { $regex: new RegExp("^" + roll + "$", "i") },
    }).sort({ examDate: 1, examTime: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch student seating details" });
  }
});

router.get("/layout", async (req, res) => {
  try {
    const { roomNumber, subjectName } = req.query;
    if (!roomNumber || !subjectName) {
      return res.status(400).json({ message: "roomNumber and subjectName are required" });
    }

    const seats = await SeatingAssignment.find({ roomNumber, subjectName }).sort({ seatNumber: 1 });

    res.json(
      seats.map((seat) => ({
        rollNumber: seat.rollNumber,
        studentName: seat.studentName,
        benchNumber: seat.benchNumber,
        seatNumber: seat.seatNumber,
      })),
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seat layout" });
  }
});

// BookMyShow-style layout source route: /api/seating/room/:roomNumber
router.get("/room/:roomNumber", async (req, res) => {
  try {
    const { roomNumber } = req.params;
    const { subjectName } = req.query;

    const query = { roomNumber };
    if (subjectName) {
      query.subjectName = subjectName;
    }

    const seats = await SeatingAssignment.find(query).sort({ seatNumber: 1 });

    res.json(
      seats.map((seat) => ({
        rollNumber: seat.rollNumber,
        benchNumber: seat.benchNumber,
        seatNumber: seat.seatNumber,
      })),
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch room seating details" });
  }
});

router.post("/generate", async (req, res) => {
  try {
    const { subjectName, examDate, examTime, reportingTime, roomNumber, columnsPerBench = 2 } = req.body;

    if (!subjectName || !examDate || !examTime || !roomNumber) {
      return res.status(400).json({ message: "subjectName, examDate, examTime and roomNumber are required" });
    }

    const students = await Student.find().sort({ rollNumber: 1 });
    if (students.length === 0) {
      return res.status(400).json({ message: "No students found to assign" });
    }

    await SeatingAssignment.deleteMany({ subjectName });

    const assignments = [];
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const seatNumber = i + 1;
      const benchNumber = Math.floor(i / Number(columnsPerBench || 2)) + 1;

      assignments.push({
        rollNumber: student.rollNumber,
        studentName: student.name,
        department: student.department,
        subjectName,
        examDate,
        examTime,
        reportingTime: reportingTime || "",
        roomNumber,
        benchNumber,
        seatNumber,
      });
    }

    const created = await SeatingAssignment.insertMany(assignments);
    res.status(201).json({
      message: "Seating arrangement generated successfully",
      count: created.length,
      assignments: created,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate seating arrangement", error: error.message });
  }
});

// Alias route requested by frontend spec: /api/seating/:rollNumber
router.get("/:rollNumber", async (req, res) => {
  try {
    const roll = req.params.rollNumber.trim();
    const assignments = await SeatingAssignment.find({
      rollNumber: { $regex: new RegExp("^" + roll + "$", "i") },
    }).sort({ examDate: 1, examTime: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch student seating details" });
  }
});

module.exports = router;
