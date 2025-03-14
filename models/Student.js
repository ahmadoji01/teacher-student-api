const { pool } = require('../config/db');

class Student {
  static async getCommonStudents(teacherIds) {
    try {
      if (!teacherIds || teacherIds.length === 0) {
        return [];
      }
      
      const [rows] = await pool.query(`
        SELECT s.email 
        FROM students s
        JOIN registrations r ON s.id = r.student_id
        WHERE r.teacher_id IN (?)
        GROUP BY s.id
        HAVING COUNT(DISTINCT r.teacher_id) = ?
      `, [teacherIds, teacherIds.length]);
      
      return rows.map(row => row.email);
    } catch (error) {
      console.error('Error in Student.getCommonStudents:', error);
      throw error;
    }
  }

  static async findOrCreate(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM students WHERE email = ?', [email]);
      
      if (rows.length > 0) {
        return rows[0];
      }
      
      const [result] = await pool.query('INSERT INTO students (email) VALUES (?)', [email]);
      
      return {
        id: result.insertId,
        email,
        is_suspended: false
      };
    } catch (error) {
      console.error('Error in Student.findOrCreate:', error);
      throw error;
    }
  }
  
  static async findByEmail(email) {
    try {
      const [rows] = await pool.query('SELECT * FROM students WHERE email = ?', [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error in Student.findByEmail:', error);
      throw error;
    }
  }

  static async suspend(email) {
    try {
      const student = await this.findByEmail(email);
      
      if (!student) {
        throw new Error('Student not found');
      }
      
      await pool.query('UPDATE students SET is_suspended = TRUE WHERE email = ?', [email]);
      
      return true;
    } catch (error) {
      console.error('Error in Student.suspend:', error);
      throw error;
    }
  }

  static async getStudentsForNotification(teacherEmail, mentionedEmails) {
    try {
      const [teacherRows] = await pool.query('SELECT id FROM teachers WHERE email = ?', [teacherEmail]);
      
      if (teacherRows.length === 0) {
        throw new Error('Teacher not found');
      }
      
      const teacherId = teacherRows[0].id;
      
      const [registeredRows] = await pool.query(`
        SELECT s.email
        FROM students s
        JOIN registrations r ON s.id = r.student_id
        WHERE r.teacher_id = ? AND s.is_suspended = FALSE
      `, [teacherId]);
      
      const registeredEmails = registeredRows.map(row => row.email);
      
      let mentionedNonSuspendedEmails = [];
      
      if (mentionedEmails && mentionedEmails.length > 0) {
        const [mentionedRows] = await pool.query(`
          SELECT email
          FROM students
          WHERE email IN (?) AND is_suspended = FALSE
        `, [mentionedEmails]);
        
        mentionedNonSuspendedEmails = mentionedRows.map(row => row.email);
      }
      
      return [...new Set([...registeredEmails, ...mentionedNonSuspendedEmails])];
    } catch (error) {
      console.error('Error in Student.getStudentsForNotification:', error);
      throw error;
    }
  }
}

module.exports = Student;