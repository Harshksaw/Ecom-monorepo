
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // THIS IS THE PROBLEM - you're using a different variable name
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;