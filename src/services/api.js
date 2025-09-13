export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Включение режима отладки (можно изменить для отладки)
const DEBUG = true;

// Функция логирования для отладки API запросов
function logApiRequest(endpoint, method, data = null) {
  if (DEBUG) {
    console.log(`🔹 API Request: ${method} ${endpoint}`);
    if (data) {
      console.log('Request data:', data);
    }
  }
}

function logApiResponse(endpoint, status, data = null) {
  if (DEBUG) {
    console.log(`🔸 API Response: ${status} ${endpoint}`);
    if (data) {
      console.log('Response data:', data);
    }
  }
}

function logApiError(endpoint, error) {
  if (DEBUG) {
    console.error(`❌ API Error: ${endpoint}`);
    console.error(error);
  }
}

// Кэш для хранения результатов запросов
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

// Функция для проверки актуальности кэша
const isCacheValid = (timestamp) => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Функция для получения данных из кэша
const getFromCache = (key) => {
  const cached = cache.get(key);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

// Функция для сохранения данных в кэш
const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Класс для пользовательских ошибок API
class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// Функция для выполнения HTTP-запросов с повторными попытками
async function fetchWithRetry(endpoint, options = {}, retries = 3) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  // Логирование запроса
  logApiRequest(endpoint, options.method || 'GET', options.body);

  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Логирование ответа
      logApiResponse(endpoint, response.status, data);

      if (!response.ok) {
        throw new APIError(
          data.message || `Ошибка сервера: ${response.status}`,
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      lastError = error;
      
      // Логирование ошибки
      logApiError(endpoint, error);
      
      // Не повторяем запрос при определенных ошибках
      if (error.status === 401 || error.status === 403 || error.status === 404) {
        throw error;
      }
      
      // Ждем перед повторной попыткой
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
}

// Функция для выполнения GET-запросов с кэшированием
async function fetchWithCache(endpoint, options = {}) {
  const cacheKey = `${endpoint}${JSON.stringify(options)}`;
  const cachedData = getFromCache(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  const data = await fetchWithRetry(endpoint, options);
  setCache(cacheKey, data);
  return data;
}

// API методы
export async function login(credentials) {
  return fetchWithRetry('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(userData) {
  return fetchWithRetry('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function getCourses(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return fetchWithCache(`/courses${queryString ? `?${queryString}` : ''}`);
}

export async function getCourseDetails(courseId) {
  return fetchWithCache(`/courses/${courseId}`);
}

export async function getEnrollments() {
  return fetchWithCache('/user/enrollments');
}

export async function enrollInCourse(courseId) {
  return fetchWithRetry('/enrollments', {
    method: 'POST',
    body: JSON.stringify({ courseId }),
  });
}

// Работа с отзывами
export async function createReview(reviewData) {
  return fetchWithRetry('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}

export async function getCourseReviews(courseId) {
  return fetchWithCache(`/courses/${courseId}/reviews`);
}

export async function getUserReviewForCourse(courseId) {
  return fetchWithCache(`/courses/${courseId}/reviews/user`);
}

export async function deleteReview(reviewId) {
  return fetchWithRetry(`/reviews/${reviewId}`, {
    method: 'DELETE',
  });
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
  cache.clear();
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export function getUserFromToken() {
  const token = localStorage.getItem('token');
  console.log('Токен:', token); // Добавляем логирование

  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Добавляем проверку срока действия
    const expDate = new Date(payload.exp * 1000);
    console.log('Токен истекает:', expDate);
    if (Date.now() >= payload.exp * 1000) {
      console.log('Токен истёк!');
      return null;
    }
    
    // Добавляем логирование данных пользователя
    const userData = {
      id: payload.userId,
      email: payload.email,
      role: payload.role
    };
    console.log('Данные пользователя из токена:', userData);
    
    return userData;
  } catch (error) {
    console.error('Ошибка при расшифровке токена:', error);
    return null;
  }
}

export async function getCourseLearningMaterials(courseId) {
  return fetchWithCache(`/courses/${courseId}/learning`);
}

export async function updateUserCourseProgress(courseId, data) {
  return fetchWithRetry(`/courses/${courseId}/progress`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Админские функции
export async function getAllUsers() {
  console.log('🔍 Вызов функции getAllUsers');
  try {
    // Проверяем авторизацию
    const userToken = getToken();
    if (!userToken) {
      console.error('❌ Ошибка авторизации: отсутствует токен');
      throw new APIError('Требуется авторизация', 401);
    }
    
    // Проверяем роль пользователя
    const currentUser = getUserFromToken();
    if (!currentUser || currentUser.role !== 'ADMIN') {
      console.error('❌ Ошибка доступа: пользователь не администратор');
      throw new APIError('Недостаточно прав', 403);
    }
    
    const data = await fetchWithRetry('/admin/users', {
      method: 'GET',
    });
    
    console.log('✅ Успешно получены данные пользователей:', data);
    return data;
  } catch (error) {
    console.error('❌ Ошибка при получении списка пользователей:', error);
    throw error;
  }
}

export async function getUserById(userId) {
  return fetchWithRetry(`/admin/users/${userId}`, {
    method: 'GET',
  });
}

export async function getUserEnrollments(userId) {
  return fetchWithRetry(`/admin/users/${userId}/enrollments`, {
    method: 'GET',
  });
}

export async function createCourse(courseData) {
  return fetchWithRetry('/admin/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
}

export async function updateCourse(courseId, courseData) {
  return fetchWithRetry(`/admin/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });
}

export async function deleteCourse(courseId) {
  return fetchWithRetry(`/admin/courses/${courseId}`, {
    method: 'DELETE',
  });
}

export async function deleteUser(userId) {
  return fetchWithRetry(`/admin/users/${userId}`, {
    method: 'DELETE',
  });
}

export function isAdmin() {
  const user = getUserFromToken();
  return user && user.role === 'ADMIN';
} 