'use strict';
require('dotenv').config();
const config = require('./config/config');
const { connectDB } = require('./config/database');
const { createApp } = require('./app');

async function start() {
  await connectDB();

  const app = createApp();

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[SERVER] WarrantyVault backend running on port ${config.port} (${config.nodeEnv})`);
  });
}

start().catch((err) => {
  console.error('[FATAL] Server failed to start:', err);
  process.exit(1);
});
