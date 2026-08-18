const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;

async function connectDB() {
  try {
    if (pool) return pool;

    pool = await sql.connect(config);
    console.log("✅ SQL Server Connected");
    return pool;
  } catch (err) {
    console.error("Database Connection Error:", err);
    process.exit(1);
  }
}

module.exports = {
  sql,
  connectDB
};