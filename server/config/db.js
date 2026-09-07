const mongoose = require('mongoose');

let memoryServer = null;
let activeMode = 'unknown'; // 'real' | 'memory'

/**
 * Connects to MongoDB.
 * - If USE_MEMORY_DB=true, skips straight to an in-memory MongoDB (mongodb-memory-server).
 * - Otherwise tries the real MONGO_URI first (short timeout) and, if that fails
 *   (e.g. no local MongoDB installed), automatically falls back to an in-memory
 *   MongoDB for the session so the app always runs with zero extra installs.
 */
const connectDB = async () => {
  const useMemory = process.env.USE_MEMORY_DB === 'true';
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/disastershield';

  if (!useMemory) {
    try {
      await mongoose.connect(mongoUri, {
        dbName: 'disastershield',
        serverSelectionTimeoutMS: 3000,
      });
      activeMode = 'real';
      console.log(`MongoDB connected: ${mongoUri}`);
      await require('../data/seed').seedIfEmpty();
      return;
    } catch (error) {
      console.warn(`Could not reach MongoDB at ${mongoUri} (${error.message}).`);
      console.warn('No local MongoDB installation found — starting a built-in in-memory database instead...');
    }
  }

  const { MongoMemoryServer } = require('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri('disastershield');
  await mongoose.connect(memoryUri, { dbName: 'disastershield' });
  activeMode = 'memory';
  console.log('In-memory MongoDB started — no local MongoDB installation required.');
  await require('../data/seed').seedIfEmpty();
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

const getDbMode = () => activeMode;

module.exports = { connectDB, disconnectDB, getDbMode };
