const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Registration = require('../models/Registration');

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

  static async registerStudents(teacherEmail, studentEmails) {
    try {
      if (!teacherEmail || !studentEmails || !Array.isArray(studentEmails) || studentEmails.length === 0) {
        throw new Error('Invalid input parameters');
      }
      
      return await Registration.register(teacherEmail, studentEmails);
    } catch (error) {
      console.error('Error in TeacherService.registerStudents:', error);
      throw error;
    }
  }

}

module.exports = TeacherService;