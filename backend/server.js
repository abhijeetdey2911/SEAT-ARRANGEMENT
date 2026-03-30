const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect DB
connectDB();

// Routes
app.use("/api/students", require("./routes/studentRoutes"));

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});
