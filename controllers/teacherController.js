const teacherService = require('../services/teacherService');

class TeacherController {
  static async getCommonStudents(req, res, next) {
    try {
      const { teacher } = req.query;
      
      if (!teacher) {
        return res.status(400).json({ message: 'Teacher parameter is required' });
      }
      
      const teachers = Array.isArray(teacher) ? teacher : [teacher];
      
      const students = await teacherService.getCommonStudents(teachers);
      
      return res.status(200).json({ students });
    } catch (error) {
      console.error('Error in getCommonStudents controller:', error);
      return res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }

  static async registerStudents(req, res, next) {
    try {
      const { teacher, students } = req.body;
      
      if (!teacher || !students || !Array.isArray(students)) {
        return res.status(400).json({ message: 'Invalid input parameters' });
      }
      
      await teacherService.registerStudents(teacher, students);
      return res.status(204).send();
    } catch (error) {
      console.error('Error in registerStudents controller:', error);
      return res.status(500).json({ message: error.message || 'Internal server error' });
    }
  }
}

module.exports = TeacherController;