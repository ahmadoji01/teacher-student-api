const teacherService = require('../../services/teacherService');
const Teacher = require('../../models/Teacher');
const Student = require('../../models/Student');
const Registration = require('../../models/Registration');
const { pool } = require('../../config/db');
const app = require('../../app');

jest.mock('../../models/Teacher');
jest.mock('../../models/Student');
jest.mock('../../models/Registration');

describe('TeacherService', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    afterAll(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await pool.end();
    })

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

        it('should throw an error if email format is invalid', async () => {
            const invalidTeacherEmail = 'test';
            const invalidStudentEmails = ['student1@example.com', 'student2'];

            await expect(teacherService.registerStudents(invalidTeacherEmail, ['student@example.com']))
                .rejects.toThrow('Invalid teacher email format');
        
            await expect(teacherService.registerStudents('teacher@example.com', invalidStudentEmails))
                .rejects.toThrow('Invalid students email format');
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

        it('should throw an error if email format is invalid', async () => {
            const invalidEmailsFormat = ['teacherjon@gmail.com', 'teacherken'];
            await expect(teacherService.getCommonStudents(invalidEmailsFormat))
                .rejects.toThrow('Invalid email format');
        })
    });

    describe('suspendStudent', () => {
        it('should suspend a student successfully', async () => {
          const studentEmail = 'student@example.com';
          Student.suspend.mockResolvedValue(true);
    
          const result = await teacherService.suspendStudent(studentEmail);
    
          expect(Student.suspend).toHaveBeenCalledWith(studentEmail);
          expect(result).toBe(true);
        });
    
        it('should throw an error if student email is missing', async () => {
          await expect(teacherService.suspendStudent(null))
            .rejects.toThrow('Student email is required');
        });
    });

    describe('retrieveForNotifications', () => {
        it('should retrieve eligible students for notification', async () => {
          const teacherEmail = 'teacher@example.com';
          const notification = 'Hello @student1@example.com and @student2@example.com';
          const eligibleStudents = ['student1@example.com', 'student2@example.com', 'student3@example.com'];
          
          Student.getStudentsForNotification.mockResolvedValue(eligibleStudents);
    
          const result = await teacherService.retrieveForNotifications(teacherEmail, notification);
    
          expect(Student.getStudentsForNotification).toHaveBeenCalledWith(
            teacherEmail, 
            ['student1@example.com', 'student2@example.com']
          );
          expect(result).toEqual(eligibleStudents);
        });
    
        it('should throw an error if parameters are missing', async () => {
          await expect(teacherService.retrieveForNotifications(null, 'Hello'))
            .rejects.toThrow('Teacher email and notification are required');
          
          await expect(teacherService.retrieveForNotifications('teacher@example.com', null))
            .rejects.toThrow('Teacher email and notification are required');
        });
    });

    describe('retrieveRegisteredStudents', () => {
      it('should retrieve registered students with their teacher', async () => {
        const teachers = ['teacherken@example.com', 'teacherjon@example.com'];
        const students = ['student1@example.com', 'student2@example.com', 'student3@example.com'];
        const registeredStudents = students.map( student => { return { student: student, teacher: teachers[Math.floor(Math.random()*teachers.length)] } })

        Registration.getRegisteredStudents.mockResolvedValue(registeredStudents);

        const result = await teacherService.retrieveRegisteredStudents();

        expect(result).toEqual(registeredStudents);
      })
    })
})