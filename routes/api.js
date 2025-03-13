const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.get('/commonstudents', teacherController.getCommonStudents);
router.post('/register', teacherController.registerStudents);
router.post('/suspend', teacherController.suspendStudent);
router.post('/retrievefornotifications', teacherController.retrieveForNotifications);
router.get('/getallstudents', teacherController.retrieveAllStudents);
router.get('/getallteachers', teacherController.retrieveAllTeachers);
router.get('/getregisteredstudents', teacherController.retrieveRegisteredStudents);

module.exports = router;