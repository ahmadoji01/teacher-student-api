const teacherService = require('../../services/teacherService');
const Teacher = require('../../models/Teacher');
const Student = require('../../models/Student');
const Registration = require('../../models/Registration');

jest.mock('../../models/Teacher');
jest.mock('../../models/Student');
jest.mock('../../models/Registration');

describe('TeacherService', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();
    });

    describe('registerStudents', () => {
        it('should register students successfully', async () => {
            const teacherEmail = 'teacher@example.com';
            const studentEmails = ['student1@example.com', 'student2@example.com'];
            Registration.register.mockResolvedValue(true);
        
            const result = await teacherService.registerStudents(teacherEmail, studentEmails);
        
            await expect(Registration.register).toHaveBeenCalledWith(teacherEmail, studentEmails);
            await expect(result).toBe(true);
        });
    
        it('should throw an error if parameters are invalid', async () => {
            await expect(teacherService.registerStudents(null, ['student@example.com']))
                .rejects.toThrow('Invalid input parameters');
        
            await expect(teacherService.registerStudents('teacher@example.com', null))
                .rejects.toThrow('Invalid input parameters');
        
            await expect(teacherService.registerStudents('teacher@example.com', []))
                .rejects.toThrow('Invalid input parameters');
        });
    });

    describe('getCommonStudents', () => {
        it('should return common students for given teachers', async () => {
          const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];
          const teachers = [
            { id: 1, email: 'teacher1@example.com' },
            { id: 2, email: 'teacher2@example.com' }
          ];
          const commonStudents = ['student1@example.com', 'student2@example.com'];
          
          Teacher.findAllByEmails.mockResolvedValue(teachers);
          Student.getCommonStudents.mockResolvedValue(commonStudents);
    
          const result = await teacherService.getCommonStudents(teacherEmails);
    
          expect(Teacher.findAllByEmails).toHaveBeenCalledWith(teacherEmails);
          expect(Student.getCommonStudents).toHaveBeenCalledWith([1, 2]);
          expect(result).toEqual(commonStudents);
        });
    
        it('should return empty array if no teachers found', async () => {
          const teacherEmails = ['nonexistent@example.com'];
          Teacher.findAllByEmails.mockResolvedValue([]);
    
          const result = await teacherService.getCommonStudents(teacherEmails);
    
          expect(Teacher.findAllByEmails).toHaveBeenCalledWith(teacherEmails);
          expect(Student.getCommonStudents).not.toHaveBeenCalled();
          expect(result).toEqual([]);
        });
    
        it('should throw an error if teacher emails are invalid', async () => {
          await expect(teacherService.getCommonStudents(null))
            .rejects.toThrow('Invalid teacher emails');
          
          await expect(teacherService.getCommonStudents([]))
            .rejects.toThrow('Invalid teacher emails');
        });
    });
})