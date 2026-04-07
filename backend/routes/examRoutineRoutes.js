const express = require("express");
const router = express.Router();
const ExamRoutine = require("../models/ExamRoutine");

router.get("/", async (_req, res) => {
  try {
    const routines = await ExamRoutine.find().sort({ examDate: 1, examTime: 1 });
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch exam routines" });
  }
});

router.post("/", async (req, res) => {
  try {
    const routine = new ExamRoutine(req.body);
    await routine.save();
    res.status(201).json(routine);
  } catch (error) {
    res.status(400).json({ message: "Failed to create exam routine", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await ExamRoutine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Exam routine not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update exam routine", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ExamRoutine.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Exam routine not found" });
    }
    res.json({ message: "Exam routine deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete exam routine" });
  }
});

module.exports = router;
