require("dotenv").confi;
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function queryDatabase(sql, params) {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(sql, params);
    connection.release();
    return results;
  } catch (err) {
    throw err;
  }
}

async function incrementFieldById(table, id) {
  try {
    const sql = `UPDATE ${table} SET click_counter = click_counter + 1 WHERE job_id = ?`;
    const [result] = await pool.query(sql, [id]);
    return result;
  } catch (err) {
    console.error("Error updating database:", err);
    throw err;
  }
}

module.exports = {queryDatabase, incrementFieldById }; 