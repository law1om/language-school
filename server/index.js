const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Эндпоинт для проверки работоспособности сервера
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Проверка соединения с базой данных
async function checkConnection() {
  try {
    await prisma.$connect();
    console.log('Успешное подключение к базе данных PostgreSQL');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
    process.exit(1);
  }
}

// Middleware для проверки авторизации
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Не авторизован' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Ошибка авторизации' });
  }
};

// Middleware для проверки роли
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }
    next();
  };
};

// Маршруты для аутентификации
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Проверка, существует ли пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'STUDENT'
      }
    });

    // Создание JWT токена
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя по email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Создание токена
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
});

// Добавляем эндпоинт для получения информации о текущем пользователе
app.get('/api/auth/user', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении данных пользователя' });
  }
});

// Маршруты для курсов
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Ошибка при получении курсов:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении курсов' });
  }
});

app.post('/api/courses', authMiddleware, roleMiddleware(['ADMIN', 'TEACHER']), async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const course = await prisma.course.create({
      data: {
        title,
        description,
        imageUrl
      }
    });
    res.status(201).json(course);
  } catch (error) {
    console.error('Ошибка при создании курса:', error);
    res.status(500).json({ message: 'Ошибка сервера при создании курса' });
  }
});

// Маршруты для записи на курсы
app.post('/api/enrollments', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Проверка существования курса
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });

    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    // Проверка, не записан ли уже пользователь на этот курс
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: parseInt(courseId)
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Вы уже записаны на этот курс' });
    }

    // Создание записи на курс
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId: parseInt(courseId)
      }
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Ошибка при записи на курс:', error);
    res.status(500).json({ message: 'Ошибка сервера при записи на курс' });
  }
});

app.get('/api/user/enrollments', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: { course: true }
    });
    res.status(200).json(enrollments);
  } catch (error) {
    console.error('Ошибка при получении записей на курсы:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении записей на курсы' });
  }
});

// Запуск сервера
app.listen(PORT, async () => {
  await checkConnection();
  console.log(`Сервер запущен на порту ${PORT}`);
}); 