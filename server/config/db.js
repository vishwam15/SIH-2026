const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/disastershield';

  try {
    await mongoose.connect(mongoUri, {
      dbName: 'disastershield',
    });
    console.log(`MongoDB connected: ${mongoUri}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

module.exports = { connectDB };
