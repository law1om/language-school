import React, { useState } from 'react';
import { isAuthenticated } from '../services/api';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';
import './CourseReviews.css';

function CourseReviews({ courseId }) {
  const [refreshReviews, setRefreshReviews] = useState(0);
  
  const handleReviewSubmitted = () => {
    // Увеличиваем счетчик, чтобы обновить список отзывов
    setRefreshReviews(prev => prev + 1);
  };

  // Обработчик для удаления отзыва
  const handleReviewDeleted = () => {
    // Увеличиваем счетчик, чтобы обновить список отзывов
    setRefreshReviews(prev => prev + 1);
  };

  return (
    <div className="course-reviews-section">
      <h2 className="section-title">Отзывы о курсе</h2>
      
      {isAuthenticated() ? (
        <ReviewForm 
          courseId={courseId} 
          onReviewSubmitted={handleReviewSubmitted} 
        />
      ) : (
        <div className="auth-message">
          <p>Чтобы оставить отзыв, необходимо <a href="#" className="login-link">войти</a> или <a href="#" className="register-link">зарегистрироваться</a>.</p>
        </div>
      )}
      
      <ReviewsList 
        courseId={courseId} 
        refresh={refreshReviews} // Передаем счетчик обновления как проп
        onReviewDeleted={handleReviewDeleted} // Передаем обработчик удаления
      />
    </div>
  );
}

export default CourseReviews; 