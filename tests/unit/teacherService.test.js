const teacherService = require('../../services/teacherService');
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
})