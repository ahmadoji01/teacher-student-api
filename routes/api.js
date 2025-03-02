const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.get('/commonstudents', teacherController.getCommonStudents);
router.post('/register', teacherController.registerStudents);

module.exports = router;