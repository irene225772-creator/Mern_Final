require('dotenv').config();

const app = require('./app');
const connectDatabase = require('./config/database');
const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, () => console.log(`Recipe API listening on port ${port}.`));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

startServer();