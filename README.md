# Teacher-Student API

This is an Express.js application with MySQL that provides API endpoints for teachers to perform administrative functions for their classes.

## Features

- Register students to a teacher
- Get common students between teachers
- Suspend a student
- Retrieve students eligible for notifications

## Local Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ahmadoji01/teacher-student-api.git
cd teacher-student-api
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the root directory and add the following:

```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=teacher_student_db
DB_PORT=3306
```

4. Create the MySQL database:

```sql
CREATE DATABASE teacher_student_db;
```

5. Start the application:

```bash
node app.js
```

The server will start on `http://localhost:3000`
