import React, { useState, useEffect } from 'react';
import { createReview, getUserReviewForCourse } from '../services/api';
import './ReviewForm.css';

const ReviewForm = ({ courseId, onReviewSubmitted }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingReview, setExistingReview] = useState(null);


  useEffect(() => {
    const loadUserReview = async () => {
      try {
        const review = await getUserReviewForCourse(courseId);
        if (review) {
          setExistingReview(review);
          setReviewText(review.text);
          setRating(review.rating);
        }
      } catch (error) {

        if (!error.message.includes('Отзыв не найден')) {
          console.error('Ошибка при загрузке отзыва пользователя:', error);
        }
      }
    };

    loadUserReview();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewText.trim()) {
      setError('Пожалуйста, введите текст отзыва');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const reviewData = {
        courseId,
        text: reviewText.trim(),
        rating
      };
      
      const result = await createReview(reviewData);
      
      if (onReviewSubmitted) {
        onReviewSubmitted(result);
      }
      
      setExistingReview(result);
      setError('');
    } catch (error) {
      setError(error.message || 'Не удалось сохранить отзыв');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h3>{existingReview ? 'Ваш отзыв' : 'Оставить отзыв'}</h3>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="rating-container">
          <label>Оценка:</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="reviewText">Ваш отзыв:</label>
          <textarea
            id="reviewText"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="4"
            placeholder="Поделитесь своим опытом..."
            disabled={loading}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Сохранение...' : existingReview ? 'Обновить отзыв' : 'Отправить отзыв'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm; 