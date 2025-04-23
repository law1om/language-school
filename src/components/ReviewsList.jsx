import React, { useState, useEffect } from 'react';
import { getCourseReviews, deleteReview, isAuthenticated, getUserFromToken } from '../services/api';
import './ReviewsList.css';

const ReviewsList = ({ courseId, refresh }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = getUserFromToken();
  
  useEffect(() => {
    const fetchReviews = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        const data = await getCourseReviews(courseId);
        setReviews(data || []);
        setError('');
      } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
        setError('Не удалось загрузить отзывы. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [courseId]);
  
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      return;
    }
    
    try {
      await deleteReview(reviewId);
      // Удаляем отзыв из локального состояния
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Ошибка при удалении отзыва:', error);
      alert('Не удалось удалить отзыв: ' + error.message);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };
  
  // Рассчитываем средний рейтинг
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;
  
  if (loading) {
    return (
      <div className="reviews-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка отзывов...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="reviews-error">
        <p>{error}</p>
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>У этого курса пока нет отзывов. Будьте первым, кто оставит отзыв!</p>
      </div>
    );
  }
  
  return (
    <div className="reviews-list">
      <div className="reviews-summary">
        <div className="average-rating">
          <span className="rating-number">{averageRating}</span>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                className={star <= Math.round(averageRating) ? 'star filled' : 'star'}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <p className="reviews-count">{reviews.length} {reviews.length === 1 ? 'отзыв' : 
          reviews.length >= 2 && reviews.length <= 4 ? 'отзыва' : 'отзывов'}</p>
      </div>

      <div className="reviews-container">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="review-user">
                <div className="user-avatar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="user-info">
                  <h4 className="user-name">{review.user?.name || 'Студент'}</h4>
                  <p className="review-date">{formatDate(review.createdAt)}</p>
                </div>
              </div>
              <div className="review-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    className={star <= review.rating ? 'star filled' : 'star'}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="review-content">
              <p className="review-text">{review.text}</p>
            </div>
            {isAuthenticated() && (currentUser?.id === review.userId || currentUser?.role === 'ADMIN') && (
              <button 
                className="delete-review-btn" 
                onClick={() => handleDeleteReview(review.id)}
              >
                Удалить
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList; 