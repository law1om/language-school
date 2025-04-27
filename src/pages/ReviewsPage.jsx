import React, { useState, useEffect } from 'react';
import { getCourses } from '../services/api';
import ReviewsList from '../components/ReviewsList';
import './ReviewsPage.css';

function ReviewsPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getCourses();
        setCourses(data || []);
        if (data && data.length > 0) {
          setSelectedCourse(data[0].id);
        }
        setError('');
      } catch (err) {
        console.error('Ошибка при загрузке курсов:', err);
        setError('Не удалось загрузить список курсов. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseChange = (e) => {
    setSelectedCourse(parseInt(e.target.value));
  };

  const handleReviewDeleted = () => {
    // Увеличиваем счетчик для обновления списка отзывов
    setRefreshReviews(prev => prev + 1);
  };

  return (
    <div className="reviews-page">
      <div className="container">
        <h1 className="page-title">Отзывы студентов</h1>
        <p className="page-description">
          Узнайте, что говорят наши студенты о курсах языковой школы. Реальные отзывы помогут 
          вам выбрать подходящий курс для изучения иностранного языка.
        </p>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка курсов...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="reviews-content">
            <div className="course-selector">
              <label htmlFor="course-select">Выберите курс:</label>
              <select 
                id="course-select" 
                value={selectedCourse || ''}
                onChange={handleCourseChange}
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedCourse && (
              <div className="selected-course-reviews">
                <ReviewsList 
                  courseId={selectedCourse} 
                  refresh={refreshReviews}
                  onReviewDeleted={handleReviewDeleted}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewsPage; 