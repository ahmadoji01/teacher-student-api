const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8',
  queueLimit: 0
});

// Initialize database tables
async function initDb() {
  try {
    const connection = await pool.getConnection();
    
    // Create teachers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create students table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        is_suspended BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create registrations table (many-to-many relationship)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id INT NOT NULL,
        student_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id),
        FOREIGN KEY (student_id) REFERENCES students(id),
        UNIQUE KEY teacher_student (teacher_id, student_id)
      )
    `);
    
    connection.release();
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

initDb().catch(console.error);

module.exports = {
  pool,
  initDb
};