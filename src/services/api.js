const API_URL = 'http://localhost:3001/api';

// Функция для выполнения HTTP-запросов
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    // Если сервер вернул ответ, пробуем распарсить его как JSON
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // Если не получилось распарсить JSON, используем текст ответа или дефолтное сообщение
      throw new Error(await response.text() || 'Не удалось получить данные от сервера');
    }
    
    if (!response.ok) {
      throw new Error(data.message || `Ошибка сервера: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    // Обработка ошибок сети
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Невозможно подключиться к серверу. Убедитесь, что сервер запущен.');
    }
    
    // Пробрасываем остальные ошибки
    throw error;
  }
}

// Аутентификация
export async function register(userData) {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function login(credentials) {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function getCurrentUser() {
  return fetchAPI('/auth/user');
}

// Работа с курсами
export async function getCourses() {
  return fetchAPI('/courses');
}

export async function createCourse(courseData) {
  return fetchAPI('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
}

// Запись на курсы
export async function enrollToCourse(courseId) {
  return fetchAPI('/enrollments', {
    method: 'POST',
    body: JSON.stringify({ courseId }),
  });
}

export async function getUserEnrollments() {
  return fetchAPI('/user/enrollments');
}

// Функции для работы с токеном
export function setToken(token) {
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function isAuthenticated() {
  return !!getToken();
}

// Функция для получения данных о пользователе из токена
export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;
  
  try {
    // Разбираем JWT токен
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    
    return {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    console.error('Ошибка при получении данных пользователя из токена', error);
    return null;
  }
} 