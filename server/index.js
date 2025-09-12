const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware для безопасности и производительности
app.use(helmet()); // Защита заголовков
app.use(compression()); // Сжатие ответов
app.use(express.json({ limit: '10kb' })); // Ограничение размера JSON

// Добавляем CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL, // Разрешаем запросы только с вашего фронтенда
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Ограничение количества запросов
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 минут
//   max: 100 // Максимум 100 запросов с одного IP
// });
// app.use('/api/', limiter);

// Глобальная обработка ошибок
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Внутренняя ошибка сервера'
  });
};

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

// Middleware для проверки JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Недействительный токен' });
  }
};

// Эндпоинт для проверки здоровья сервера
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Применяем обработчик ошибок
app.use(errorHandler);

// Эндпоинт для заполнения базы данных демонстрационными данными
app.post('/api/seed-database', async (req, res) => {
  try {
    // Проверяем, есть ли уже курсы в базе
    const coursesCount = await prisma.course.count();
    
    if (coursesCount > 0) {
      return res.status(400).json({ message: 'База данных уже содержит курсы' });
    }
    
    // Демонстрационные курсы
    const demoCourses = [
      {
        title: "Английский язык",
        description: "Погрузись в мир английского! Курсы для всех уровней от начинающих до продвинутых. Разговорная практика с носителями и подготовка к международным экзаменам.",
        imageUrl: "/courses-bg/eng-bg.avif"
      },
      {
        title: "Немецкий язык",
        description: "Открой для себя язык Гёте! Грамматика и произношение с нуля, бизнес-немецкий и подготовка к Goethe-Zertifikat.",
        imageUrl: "/courses-bg/ger-bg.avif"
      },
      {
        title: "Французский язык",
        description: "Говори, как парижанин! Французский с нуля до продвинутого уровня. Подготовка к DELF/DALF и разговорные клубы.",
        imageUrl: "/courses-bg/fr-bg.avif"
      },
      {
        title: "Испанский язык",
        description: "Почувствуй страсть Испании! Особенности испанского в Латинской Америке и Испании, подготовка к DELE и изучение культуры испаноязычных стран.",
        imageUrl: "/courses-bg/esp-bg.avif"
      },
      {
        title: "Итальянский язык",
        description: "Говори, как в Италии! Итальянский для путешествий, изучение музыки и кино на итальянском, погружение в культуру.",
        imageUrl: "/courses-bg/italy-bg.avif"
      },
      {
        title: "Японский язык",
        description: "Погрузись в культуру Японии! Занятия с носителями языка, подготовка к JLPT (N5–N1) и практика через чтение манги.",
        imageUrl: "/courses-bg/japon-bg.avif"
      },
      {
        title: "Китайский язык",
        description: "Откройте для себя язык будущего! Изучение иероглифов с нуля, подготовка к HSK (1-6) и бизнес-китайский.",
        imageUrl: "/courses-bg/china-bg.avif"
      },
      {
        title: "Корейский язык",
        description: "Погрузитесь в K-culture! Изучение корейского алфавита и грамматики, подготовка к TOPIK и погружение в мир K-pop.",
        imageUrl: "/courses-bg/korea-bg.avif"
      },
      {
        title: "Арабский язык",
        description: "Изучите язык Ближнего Востока! Арабский алфавит и каллиграфия, изучение диалектов и культуры арабских стран.",
        imageUrl: "/courses-bg/arab-bg.avif"
      },
      {
        title: "Португальский язык",
        description: "Откройте мир лузофонии! Изучение особенностей португальского в Португалии и Бразилии, подготовка к CAPLE.",
        imageUrl: "/courses-bg/portugal-bg.avif"
      }
    ];
    
    // Добавляем курсы в базу данных
    const createdCourses = await prisma.course.createMany({
      data: demoCourses
    });
    
    res.status(201).json({ 
      message: `Добавлено ${createdCourses.count} демонстрационных курсов в базу данных`,
      coursesCount: createdCourses.count
    });
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
    res.status(500).json({ message: 'Ошибка сервера при заполнении базы данных' });
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Получен сигнал SIGTERM. Выполняется graceful shutdown...');
  await prisma.$disconnect();
  process.exit(0);
});

// Запуск сервера
const server = app.listen(PORT, async () => {
  await checkConnection();
  console.log(`Сервер запущен на порту ${PORT}`);
});

// Настройка таймаута сервера
server.timeout = 30000; // 30 секунд

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
app.get('/api/auth/user', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
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

// Получение деталей конкретного курса
app.get('/api/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const courseId = parseInt(id);
    
    // Данные демонстрационных курсов из фронтенда для случая, если курса нет в базе
    const demoCoursesData = [
      { id: 1, title: "Английский язык", description: "Погрузись в мир английского!", image: "/courses-bg/eng-bg.avif" },
      { id: 2, title: "Немецкий язык", description: "Открой для себя язык Гёте!", image: "/courses-bg/ger-bg.avif" },
      { id: 3, title: "Французский язык", description: "Говори, как парижанин!", image: "/courses-bg/fr-bg.avif" },
      { id: 4, title: "Испанский язык", description: "Почувствуй страсть Испании!", image: "/courses-bg/esp-bg.avif" },
      { id: 5, title: "Итальянский язык", description: "Говори, как в Италии!", image: "/courses-bg/italy-bg.avif" },
      { id: 6, title: "Японский язык", description: "Погрузись в культуру Японии!", image: "/courses-bg/japon-bg.avif" },
      { id: 7, title: "Китайский язык", description: "Откройте для себя язык будущего!", image: "/courses-bg/china-bg.avif" },
      { id: 8, title: "Корейский язык", description: "Погрузитесь в K-culture!", image: "/courses-bg/korea-bg.avif" },
      { id: 9, title: "Арабский язык", description: "Изучите язык Ближнего Востока!", image: "/courses-bg/arab-bg.avif" },
      { id: 10, title: "Португальский язык", description: "Откройте мир лузофонии!", image: "/courses-bg/portugal-bg.avif" }
    ];
    
    // Пробуем найти курс в базе данных
    let course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    
    // Если курс не найден в базе, но есть в демо-данных
    if (!course && courseId >= 1 && courseId <= demoCoursesData.length) {
      const demoData = demoCoursesData[courseId - 1];
      
      // Создаем объект курса из демо-данных
      course = {
        id: demoData.id,
        title: demoData.title,
        description: demoData.description,
        imageUrl: demoData.image,
        createdAt: new Date(),
        updatedAt: new Date(),
        reviews: []
      };
    }
    
    // Если курс не найден ни в базе, ни в демо-данных
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }
    
    // Расчет среднего рейтинга
    let averageRating = 0;
    if (course.reviews && course.reviews.length > 0) {
      averageRating = course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length;
    }
    
    // Добавляем подробные данные для фронтенда
    const courseData = {
      ...course,
      averageRating,
      reviewsCount: course.reviews ? course.reviews.length : 0
    };
    
    res.status(200).json(courseData);
  } catch (error) {
    console.error('Ошибка при получении деталей курса:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении деталей курса' });
  }
});

app.post('/api/courses', authenticateToken, async (req, res) => {
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
app.post('/api/enrollments', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.userId;

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

app.get('/api/user/enrollments', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
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

// Маршруты для отзывов
app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const { courseId, text, rating } = req.body;
    const userId = req.user.userId;

    // Проверка существования курса
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });

    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    // Проверка, не оставлял ли пользователь уже отзыв для этого курса
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        courseId: parseInt(courseId)
      }
    });

    if (existingReview) {
      // Обновляем существующий отзыв
      const updatedReview = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          text,
          rating: parseInt(rating)
        }
      });
      return res.status(200).json(updatedReview);
    }

    // Создание нового отзыва
    const review = await prisma.review.create({
      data: {
        text,
        rating: parseInt(rating),
        userId,
        courseId: parseInt(courseId)
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Ошибка при создании отзыва:', error);
    res.status(500).json({ message: 'Ошибка сервера при создании отзыва' });
  }
});

// Получение всех отзывов для курса
app.get('/api/courses/:courseId/reviews', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const reviews = await prisma.review.findMany({
      where: { courseId: parseInt(courseId) },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Ошибка при получении отзывов:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении отзывов' });
  }
});

// Получение отзыва пользователя для курса
app.get('/api/courses/:courseId/reviews/user', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;
    
    const review = await prisma.review.findFirst({
      where: {
        courseId: parseInt(courseId),
        userId
      }
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }
    
    res.status(200).json(review);
  } catch (error) {
    console.error('Ошибка при получении отзыва пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении отзыва пользователя' });
  }
});

// Удаление отзыва
app.delete('/api/reviews/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;
    
    // Находим отзыв
    const review = await prisma.review.findUnique({
      where: { id: parseInt(reviewId) }
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }
    
    // Проверяем права пользователя (может удалить только свой отзыв или админ)
    if (review.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Недостаточно прав для удаления отзыва' });
    }
    
    // Удаляем отзыв
    await prisma.review.delete({
      where: { id: parseInt(reviewId) }
    });
    
    res.status(200).json({ message: 'Отзыв успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении отзыва:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении отзыва' });
  }
});

// Маршруты для административной панели
// Получение всех пользователей (только для администраторов)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    // Проверяем, является ли пользователь администратором
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора.' });
    }
    
    // Получаем всех пользователей
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Ошибка при получении списка пользователей:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении списка пользователей' });
  }
});

// Получение данных пользователя по ID (только для администраторов)
app.get('/api/admin/users/:userId', authenticateToken, async (req, res) => {
  try {
    // Проверяем, является ли пользователь администратором
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора.' });
    }
    
    const { userId } = req.params;
    
    // Получаем данные пользователя
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
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
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении данных пользователя' });
  }
});

// Получение записей на курсы пользователя (только для администраторов)
app.get('/api/admin/users/:userId/enrollments', authenticateToken, async (req, res) => {
  try {
    // Проверяем, является ли пользователь администратором
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора.' });
    }
    
    const { userId } = req.params;
    
    // Получаем записи на курсы для указанного пользователя
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: parseInt(userId) },
      include: { course: true }
    });
    
    res.status(200).json(enrollments);
  } catch (error) {
    console.error('Ошибка при получении записей пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при получении записей пользователя' });
  }
});

// Удаление пользователя (только для администраторов)
app.delete('/api/admin/users/:userId', authenticateToken, async (req, res) => {
  try {
    // Проверяем, является ли пользователь администратором
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора.' });
    }
    
    const { userId } = req.params;
    const userIdInt = parseInt(userId);
    
    // Проверяем, не пытается ли админ удалить себя
    if (req.user.userId === userIdInt) {
      return res.status(400).json({ message: 'Вы не можете удалить свою учетную запись.' });
    }
    
    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: userIdInt }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    // Проверяем, не пытается ли админ удалить другого админа
    if (user.role === 'ADMIN') {
      return res.status(400).json({ message: 'Невозможно удалить администратора' });
    }
    
    // Сначала удаляем связанные данные (записи на курсы и отзывы)
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { userId: userIdInt } }),
      prisma.enrollment.deleteMany({ where: { userId: userIdInt } }),
      prisma.user.delete({ where: { id: userIdInt } })
    ]);
    
    res.status(200).json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении пользователя' });
  }
}); 