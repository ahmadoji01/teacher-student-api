const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Registration = require('../models/Registration');

class TeacherService {
  static async getCommonStudents(teacherEmails) {
    try {
      if (!teacherEmails || !Array.isArray(teacherEmails) || teacherEmails.length === 0) {
        throw new Error('Invalid teacher emails');
      }
      
      teacherEmails.map( teacher => {
        if (!this.isValidEmail(teacher))
          throw new Error('Invalid email format');
      })

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

      if (!this.isValidEmail(teacherEmail))
        throw new Error('Invalid teacher email format');

      studentEmails.map( student => {
        if (!this.isValidEmail(student))
          throw new Error('Invalid students email format');
      })
      
      return await Registration.register(teacherEmail, studentEmails);
    } catch (error) {
      console.error('Error in TeacherService.registerStudents:', error);
      throw error;
    }
  }
  
  static async suspendStudent(studentEmail) {
    try {
      if (!studentEmail) {
        throw new Error('Student email is required');
      }
      
      return await Student.suspend(studentEmail);
    } catch (error) {
      console.error('Error in TeacherService.suspendStudent:', error);
      throw error;
    }
  }

  static async retrieveForNotifications(teacherEmail, notification) {
    try {
      if (!teacherEmail || !notification) {
        throw new Error('Teacher email and notification are required');
      }
      
      const mentionedEmails = this.extractMentionedEmails(notification);

      return await Student.getStudentsForNotification(teacherEmail, mentionedEmails);
    } catch (error) {
      console.error('Error in TeacherService.retrieveForNotifications:', error);
      throw error;
    }
  }

  static async retrieveAllStudents() {
    try {
      return await Student.getAllStudents();
    } catch (error) {
      console.error('Error in TeacherService.retrieveAllStudents:', error);
      throw error;
    }
  }

  static extractMentionedEmails(notification) {
    const regex = /@([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
    const matches = notification.match(regex);
    if (!matches) {
      return [];
    }
    return matches.map(match => match.substring(1));
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = TeacherService;