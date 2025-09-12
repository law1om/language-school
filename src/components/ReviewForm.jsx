import React, { useState, useEffect } from 'react';
import { createReview, getUserReviewForCourse, deleteReview } from '../services/api';
import './ReviewForm.css';

function ReviewForm({ courseId, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Загрузка существующего отзыва пользователя
  useEffect(() => {
    async function fetchUserReview() {
      try {
        const review = await getUserReviewForCourse(courseId);
        if (review) {
          setUserReview(review);
          // Заполняем форму, если переходим в режим редактирования
          if (isEditing) {
            setText(review.text);
            setRating(review.rating);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке отзыва:', error);
      }
    }

    if (courseId) {
      fetchUserReview();
    }
  }, [courseId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Пожалуйста, добавьте текст отзыва');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await createReview({
        courseId,
        text,
        rating
      });
      
      setText('');
      setRating(5);
      setIsEditing(false);
      
      // Обновляем список отзывов
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
    } catch (error) {
      console.error('Ошибка при отправке отзыва:', error);
      setError('Не удалось отправить отзыв. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userReview) return;
    
    if (!window.confirm('Вы действительно хотите удалить свой отзыв?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteReview(userReview.id);
      setUserReview(null);
      
      // Обновляем список отзывов
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Ошибка при удалении отзыва:', error);
      setError('Не удалось удалить отзыв. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  // Если у пользователя есть отзыв и он не в режиме редактирования
  if (userReview && !isEditing) {
    return (
      <div className="user-review">
        <h3>Ваш отзыв</h3>
        <div className="review-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= userReview.rating ? 'star filled' : 'star'}>★</span>
          ))}
        </div>
        <p className="review-text">{userReview.text}</p>
        <div className="review-actions">
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Редактировать
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Удалить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-form">
      <h3>{isEditing ? 'Редактировать отзыв' : 'Оставить отзыв'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="rating-selector">
          <p>Ваша оценка:</p>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= rating ? 'star filled' : 'star'}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="review-text">Ваш отзыв:</label>
          <textarea
            id="review-text"
            className="review-text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="5"
            placeholder="Поделитесь своими впечатлениями о курсе..."
          ></textarea>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-actions">
          {isEditing && (
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setIsEditing(false)}
            >
              Отмена
            </button>
          )}
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Отправка...' : (isEditing ? 'Сохранить изменения' : 'Отправить отзыв')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm; 