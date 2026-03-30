const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://amitmallik399_db_user:Amallik0401@cluster0.n99uhzt.mongodb.net/",
    );
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("Not connected ❌", error);
    process.exit(1);
  }
};

module.exports = connectDB;
