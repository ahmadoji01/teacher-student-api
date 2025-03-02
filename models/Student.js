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
}

module.exports = Student;