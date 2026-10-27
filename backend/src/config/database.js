const mongoose = require('mongoose');

async function connectDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is required. Add it to backend/.env before starting the API.');
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');
}

module.exports = connectDatabase;