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
}

module.exports = Teacher;