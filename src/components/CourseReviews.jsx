import React, { useState } from 'react';
import { isAuthenticated } from '../services/api';
import ReviewForm from './ReviewForm';
import ReviewsList from './ReviewsList';
import './CourseReviews.css';

const CourseReviews = ({ courseId }) => {
  const [refreshReviews, setRefreshReviews] = useState(0);
  const isLoggedIn = isAuthenticated();

  const handleReviewSubmitted = () => {
    setRefreshReviews(prev => prev + 1);
  };

  return (
    <div className="course-reviews-container">
      <h2>Отзывы о курсе</h2>
      
      {isLoggedIn ? (
        <ReviewForm 
          courseId={courseId} 
          onReviewSubmitted={handleReviewSubmitted} 
        />
      ) : (
        <div className="login-prompt">
          <p>Чтобы оставить отзыв, пожалуйста, авторизуйтесь.</p>
        </div>
      )}
      
      <ReviewsList courseId={courseId} refresh={refreshReviews} />
    </div>
  );
};

export default CourseReviews; 