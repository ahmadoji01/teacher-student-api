CREATE DATABASE IF NOT EXISTS teacher_student_db;
USE teacher_student_db;

DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS teachers;

CREATE TABLE teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_suspended BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB;

CREATE TABLE registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id INT NOT NULL,
  student_id INT NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_registration (teacher_id, student_id)
) ENGINE=InnoDB;

INSERT INTO teachers (email) VALUES 
  ('teacherken@gmail.com'),
  ('teacherjoe@gmail.com');

INSERT INTO students (email, is_suspended) VALUES 
  ('studentbob@gmail.com', FALSE),
  ('commonstudent1@gmail.com', FALSE),
  ('commonstudent2@gmail.com', FALSE),
  ('student_only_under_teacher_ken@gmail.com', FALSE),
  ('student_only_under_teacher_joe@gmail.com', FALSE),
  ('studentmary@gmail.com', TRUE);

INSERT INTO registrations (teacher_id, student_id) VALUES
  (1, 1), -- teacherken -> studentbob
  (1, 2), -- teacherken -> commonstudent1
  (1, 3), -- teacherken -> commonstudent2
  (1, 4), -- teacherken -> student_only_under_teacher_ken
  (2, 2), -- teacherjoe -> commonstudent1
  (2, 3), -- teacherjoe -> commonstudent2
  (2, 5); -- teacherjoe -> student_only_under_teacher_joe