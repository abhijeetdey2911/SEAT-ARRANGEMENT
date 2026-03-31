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

// Student login route
app.post("/api/login", async (req, res) => {
  try {
    const { rollNumber, password } = req.body;

    if (!rollNumber || !password) {
      return res.status(400).json({ message: "rollNumber and password are required" });
    }

    const rollNumberTrimmed = rollNumber.trim();

    // Debug logs
    console.log("Login attempt:", rollNumberTrimmed);

    // Case-insensitive exact match using regex
    const student = await Student.findOne({
      rollNumber: {
        $regex: new RegExp("^" + rollNumberTrimmed + "$", "i"),
      },
    });

    console.log("Found student:", student);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
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
