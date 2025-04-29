
Built by https://www.blackbox.ai

---

```markdown
# Instituto Police Web

## Project Overview

**Instituto Police Web** is a web application developed for the Instituto Médio Politecnico Huambo Calunga 4P. The platform allows for user permissions management, integrates with a MySQL database, and facilitates student enrollment in various courses.

## Installation

To set up the project on your local machine, you need to follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your_username/instituto-police-web.git
   cd instituto-police-web
   ```

2. **Install dependencies**:
   Ensure you have [Node.js](https://nodejs.org/) and [MySQL](https://www.mysql.com/) installed. Then, run:
   ```bash
   npm install
   ```

3. **Set up your MySQL database**:
   - Create a database named `instituto_politecnico`.
   - Create necessary tables for users, courses, and enrollments. You can refer to the SQL scripts provided in the `sql` directory (if available) or use the existing table structure in your MySQL database.

4. **Configure your MySQL connection**:
   Update the MySQL connection settings in `server.js`:
   ```javascript
   const pool = mysql.createPool({
     host: 'localhost',
     user: 'root',
     password: '', // Set your MySQL root password here
     database: 'instituto_politecnico',
   });
   ```

5. **Run the application**:
   Start the server with:
   ```bash
   npm start
   ```

   The application should now be running at `http://localhost:3000`.

## Usage

1. Navigate to the home page to view available courses.
2. Go to the enrollment page to register a new student for a course.
3. Access the admin panel to manage enrollments and view existing registrations.

## Features

- **User Registration**: Users can register with a username and password.
- **Course Enrollment**: Students can enroll in different courses.
- **Admin Panel**: Admin users can view and manage enrollments.

## Dependencies

The project relies on the following Node.js packages, as outlined in `package.json`:

- `express`: Web framework for Node.js.
- `mysql2`: MySQL client for Node.js with promise support.
- `express-session`: Middleware for session handling.
- `bcrypt`: Library to hash passwords.
- `ejs`: Embedded JavaScript templating.
- `connect-flash`: Flash messages middleware.
- `body-parser`: Middleware to parse incoming request bodies.

## Project Structure

Here's an overview of the project's file structure:

```
instituto-police-web/
├── public/               # Static files (CSS, JavaScript, images)
├── views/                # EJS template files
│   ├── index.ejs        # Home page
│   ├── enroll.ejs       # Enrollment page
│   └── admin.ejs        # Admin panel page
├── server.js             # Main server file
├── package.json          # Project dependencies and scripts
└── package-lock.json     # Exact version of dependencies
```

### Directory Explanation

- **public/**: This directory contains static assets like stylesheets and client-side scripts.
- **views/**: Contains EJS templates that are rendered for each route.

## Conclusion

This project serves as a foundational platform for managing course enrollments at the Instituto Médio Politecnico Huambo Calunga 4P. Feel free to extend its functionalities or modify it as per your needs.
```