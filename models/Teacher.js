const { pool } = require('../config/db');

class Teacher {
  static async findAllByEmails(emails) {
    try {
      if (!emails || emails.length === 0) {
        return [];
      }
      
      const placeholders = emails.map(() => '?').join(',');
      const [rows] = await pool.query(`SELECT * FROM teachers WHERE email IN (${placeholders})`, emails);
      
      return rows;
    } catch (error) {
      console.error('Error in Teacher.findAllByEmails:', error);
      throw error;
    }
  }

  static async findOrCreate(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM teachers WHERE email = ?', [email]);
      
      if (rows.length > 0) {
        return rows[0];
      }
      
      const [result] = await pool.query('INSERT INTO teachers (email) VALUES (?)', [email]);
      
      return {
        id: result.insertId,
        email
      };
    } catch (error) {
      console.error('Error in Teacher.findOrCreate:', error);
      throw error;
    }
  }

  static async getAllTeachers() {
    try {
      const [rows] = await pool.query('SELECT email FROM teachers');
      return rows.map(row => row.email);
    } catch (error) {
      console.error('Error in Teacher.getAllTeachers:', error);
      throw error;
    }
  }
}

module.exports = Teacher;