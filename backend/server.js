const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const Student = require("./models/Student");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect DB
connectDB();

// Routes
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/exam-routine", require("./routes/examRoutineRoutes"));
app.use("/api/examRoutine", require("./routes/examRoutineRoutes"));
app.use("/api/seating", require("./routes/seatingRoutes"));

// Student login route
app.post("/api/login", async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    if (!rollNumber || !password) {
      return res.status(400).json({ message: "rollNumber and password are required" });
    }

    const rollNumberTrimmed = rollNumber.trim();

    console.log("Login attempt:", rollNumberTrimmed);

    // Case-insensitive exact match using regex
    const student = await Student.findOne({
      rollNumber: {
        $regex: new RegExp("^" + rollNumberTrimmed + "$", "i"),
      },
    });

    console.log("Found student:", student);

    if (!student) {
      // No auth checks: allow login with any credentials for testing
      return res.json({
        name: "Guest Student",
        rollNumber: rollNumberTrimmed,
        department: "MCA",
        exam: "Demo",
      });
    }

    return res.json(student);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});
