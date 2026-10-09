'use strict';
const mongoose = require('mongoose');
const config = require('./config');

let retries = 0;
const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

async function connectDB() {
  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[DB] Connected to MongoDB at ${config.mongoUri}`);
      return;
    } catch (err) {
      retries++;
      console.error(`[DB] Connection attempt ${retries}/${MAX_RETRIES} failed: ${err.message}`);
      if (retries >= MAX_RETRIES) {
        console.error('[DB] Max retries reached. Exiting.');
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
    }
  }
}

module.exports = { connectDB };
