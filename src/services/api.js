const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

export async function createCourse(courseData) {
  return fetchWithRetry('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
}

export async function updateCourse(courseId, courseData) {
  return fetchWithRetry(`/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });
}

export async function deleteCourse(courseId) {
  return fetchWithRetry(`/courses/${courseId}`, {
    method: 'DELETE',
  });
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
  clearCache();
}

export function clearCache() {
  cache.clear();
}

export function isAuthenticated() {
  return !!getToken();
}

// Функция для получения данных о пользователе из токена
export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;
  
  try {
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