const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

class TeacherService {
  static async getCommonStudents(teacherEmails) {
    try {
      if (!teacherEmails || !Array.isArray(teacherEmails) || teacherEmails.length === 0) {
        throw new Error('Invalid teacher emails');
      }
      
      const teachers = await Teacher.findAllByEmails(teacherEmails);
      if (teachers.length === 0) {
        return [];
      }

      const teacherIds = teachers.map(teacher => teacher.id);
      return await Student.getCommonStudents(teacherIds);
    } catch (error) {
      console.error('Error in TeacherService.getCommonStudents:', error);
      throw error;
    }
  }
}

module.exports = TeacherService;