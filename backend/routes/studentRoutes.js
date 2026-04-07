const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// ➤ Add single student
router.post("/add", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ➤ REST add student
router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: "Failed to add student", error: error.message });
  }
});

// ➤ Bulk add students
router.post("/bulk-add", async (req, res) => {
  try {
    const students = await Student.insertMany(req.body, { ordered: false });
    res.status(201).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ➤ Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ seatNumber: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Get student by rollNumber
router.get("/:rollNumber", async (req, res) => {
  try {
    const student = await Student.findOne({
      rollNumber: req.params.rollNumber,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Update student by id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update student", error: error.message });
  }
});

// ➤ Delete student by id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student" });
  }
});

// ➤ Reset seats
router.post("/reset-seats", async (req, res) => {
  try {
    await Student.updateMany(
      {},
      {
        seatNumber: null,
        benchNumber: null,
        seatPosition: null,
        classroom: null,
        examTime: null,
      },
    );

    res.json({ message: "Seats reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Allocate seats (FINAL VERSION 🔥)
router.post("/allocate-seats", async (req, res) => {
  try {
    let students = await Student.find();

    if (students.length === 0) {
      return res.status(400).json({ message: "No students found" });
    }

    // ❗ Prevent re-allocation
    const alreadyAllocated = students.some((s) => s.seatNumber !== null);
    if (alreadyAllocated) {
      return res.status(400).json({
        message: "Seats already allocated. Reset first.",
      });
    }

    const { classrooms, examTime } = req.body;

    if (!classrooms || classrooms.length === 0) {
      return res.status(400).json({ message: "Classrooms required" });
    }

    if (!examTime) {
      return res.status(400).json({ message: "examTime required" });
    }

    // ✅ Capacity check
    const totalCapacity = classrooms.reduce((sum, c) => sum + c.capacity, 0);

    if (students.length > totalCapacity) {
      return res.status(400).json({
        message: "Not enough seats available",
      });
    }

    // ✅ Optimized classroom mapping
    let classroomMap = {};
    let studentIndex = 0;

    for (let room of classrooms) {
      for (let i = 0; i < room.capacity; i++) {
        if (studentIndex < students.length) {
          classroomMap[students[studentIndex]._id.toString()] = room.name;
          studentIndex++;
        }
      }
    }

    // ✅ Group by department
    const deptMap = {};
    students.forEach((s) => {
      if (!deptMap[s.department]) {
        deptMap[s.department] = [];
      }
      deptMap[s.department].push(s);
    });

    let deptList = Object.keys(deptMap).map((d) => ({
      department: d,
      students: deptMap[d],
    }));

    let benches = [];
    let benchNumber = 1;

    while (deptList.length > 0) {
      let first = deptList[0];

      let second = deptList.find((d) => d.department !== first.department);

      let leftStudent = first.students.shift();
      let rightStudent = second ? second.students.shift() : null;

      if (leftStudent) {
        leftStudent.benchNumber = benchNumber;
        leftStudent.seatPosition = "left";
        leftStudent.classroom =
          classroomMap[leftStudent._id.toString()] || null;
        leftStudent.examTime = examTime;
      }

      if (rightStudent) {
        rightStudent.benchNumber = benchNumber;
        rightStudent.seatPosition = "right";
        rightStudent.classroom =
          classroomMap[rightStudent._id.toString()] || null;
        rightStudent.examTime = examTime;
      }

      benches.push({
        bench: benchNumber,
        left: leftStudent,
        right: rightStudent,
      });

      deptList = deptList.filter((d) => d.students.length > 0);

      benchNumber++;
    }

    // ✅ Assign seat numbers
    let seat = 1;
    for (let bench of benches) {
      if (bench.left) {
        bench.left.seatNumber = seat++;
        await bench.left.save();
      }
      if (bench.right) {
        bench.right.seatNumber = seat++;
        await bench.right.save();
      }
    }

    res.json({
      message: "Seats allocated successfully",
      benches,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Layout API
router.get("/layout", async (req, res) => {
  try {
    const rows = parseInt(req.query.rows);
    const cols = parseInt(req.query.cols);

    if (!rows || !cols) {
      return res.status(400).json({ error: "rows and cols required" });
    }

    const students = await Student.find().sort({ benchNumber: 1 });

    const benchMap = {};
    students.forEach((s) => {
      if (!s.benchNumber || !s.seatPosition) return;

      if (!benchMap[s.benchNumber]) {
        benchMap[s.benchNumber] = {};
      }

      benchMap[s.benchNumber][s.seatPosition] = {
        name: s.name,
        department: s.department,
        rollNumber: s.rollNumber,
      };
    });

    const benches = Object.values(benchMap);

    let layout = [];
    let index = 0;

    for (let r = 0; r < rows; r++) {
      let row = [];

      for (let c = 0; c < cols; c++) {
        if (index < benches.length) {
          row.push(benches[index]);
          index++;
        } else {
          row.push(null);
        }
      }

      layout.push(row);
    }

    res.json(layout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
