import React, { useState, useEffect } from 'react';
import { getCourseReviews, deleteReview, isAuthenticated, getUserFromToken } from '../services/api';
import './ReviewsList.css';

const ReviewsList = ({ courseId, refresh }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = getUserFromToken();
  
  useEffect(() => {
    loadReviews();
  }, [courseId, refresh]);
  
  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await getCourseReviews(courseId);
      setReviews(data);
      setError('');
    } catch (error) {
      setError('Не удалось загрузить отзывы');
      console.error('Ошибка при загрузке отзывов:', error);
    } finally {
      setLoading(false);
    }
  };
  
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
  
  if (loading) {
    return <div className="reviews-loading">Загрузка отзывов...</div>;
  }
  
  if (error) {
    return <div className="reviews-error">{error}</div>;
  }
  
  if (reviews.length === 0) {
    return <div className="no-reviews">Пока нет отзывов для этого курса</div>;
  }
  
  return (
    <div className="reviews-list">
      <h3>Отзывы студентов ({reviews.length})</h3>
      {reviews.map(review => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <div className="review-author">{review.user?.name || 'Анонимный пользователь'}</div>
            <div className="review-date">{formatDate(review.createdAt)}</div>
          </div>
          
          <div className="review-rating">
            {Array(5).fill().map((_, i) => (
              <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>★</span>
            ))}
          </div>
          
          <div className="review-text">{review.text}</div>
          
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
  );
};

export default ReviewsList; 