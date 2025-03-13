const { pool } = require('../config/db');
const Teacher = require('./Teacher');
const Student = require('./Student');

class Registration {
  static async register(teacherEmail, studentEmails) {
    try {
      const teacher = await Teacher.findOrCreate(teacherEmail);
      
      for (const studentEmail of studentEmails) {
        const student = await Student.findOrCreate(studentEmail);
        
        try {
          await pool.query(
            'INSERT INTO registrations (teacher_id, student_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id',
            [teacher.id, student.id]
          );
        } catch (error) {
          if (error.code !== 'ER_DUP_ENTRY') {
            throw error;
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error in Registration.register:', error);
      throw error;
    }
  }

  static async getRegisteredStudents() {
    try {
      const [students] = await pool.query(`
        SELECT s.email AS student_email, t.email AS teacher_email
        FROM registrations r
        JOIN students s ON r.student_id = s.id
        JOIN teachers t ON r.teacher_id = t.id
        GROUP BY s.id
      `)
      return students;
    } catch (error) {
      console.error('Error in Registration.getRegisteredStudents:', error);
      throw error;
    }
  }
}

module.exports = Registration;