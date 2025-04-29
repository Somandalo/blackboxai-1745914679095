const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const mysql = require('mysql2/promise');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Set your MySQL root password here
  database: 'instituto_politecnico',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Make pool accessible to routers
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.get('/', async (req, res) => {
  try {
    const [courses] = await req.pool.query('SELECT * FROM courses');
    res.render('index', { title: 'Home', courses });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar os cursos');
  }
});

app.get('/enroll', async (req, res) => {
  try {
    const [courses] = await req.pool.query('SELECT * FROM courses');
    res.render('enroll', { title: 'Matrícula', courses, message: null, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar o formulário de matrícula');
  }
});

app.post('/enroll', async (req, res) => {
  const { username, password, course_id } = req.body;
  if (!username || !password || !course_id) {
    const [courses] = await req.pool.query('SELECT * FROM courses');
    return res.render('enroll', { title: 'Matrícula', courses, message: null, error: 'Por favor, preencha todos os campos.' });
  }
  try {
    // Check if user exists
    const [existingUsers] = await req.pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      const [courses] = await req.pool.query('SELECT * FROM courses');
      return res.render('enroll', { title: 'Matrícula', courses, message: null, error: 'Nome de usuário já existe.' });
    }
    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert user
    const [result] = await req.pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, 'student']);
    const userId = result.insertId;
    // Insert enrollment
    await req.pool.query('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)', [userId, course_id]);
    const [courses] = await req.pool.query('SELECT * FROM courses');
    res.render('enroll', { title: 'Matrícula', courses, message: 'Matrícula realizada com sucesso!', error: null });
  } catch (error) {
    console.error(error);
    const [courses] = await req.pool.query('SELECT * FROM courses');
    res.render('enroll', { title: 'Matrícula', courses, message: null, error: 'Erro ao processar a matrícula.' });
  }
});

app.get('/admin', async (req, res) => {
  try {
    // Join enrollments with users and courses
    const [enrollments] = await req.pool.query(
      `SELECT enrollments.id, users.username, courses.name AS course_name, enrollments.enrolled_at
       FROM enrollments
       JOIN users ON enrollments.user_id = users.id
       JOIN courses ON enrollments.course_id = courses.id
       ORDER BY enrollments.enrolled_at DESC`
    );
    const [courses] = await req.pool.query('SELECT * FROM courses');
    res.render('admin', { title: 'Admin', enrollments, courses });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar o painel administrativo');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
