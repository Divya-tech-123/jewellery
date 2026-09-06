const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lumiere', {
      serverSelectionTimeoutMS: 2500, // Quick timeout to fallback if local mongod is not started
    });
    isConnected = true;
    console.log(`[LUMIÈRE DATABASE] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[LUMIÈRE DATABASE] Local MongoDB server not reachable (${error.message}).`);
    console.log('[LUMIÈRE DATABASE] Operating in resilient InMemory Hybrid Mode with complete seed data.');
    isConnected = false;
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
