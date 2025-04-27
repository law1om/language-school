import React, { useState, useEffect, useRef } from 'react';
import { getCourseReviews, deleteReview, isAuthenticated, getUserFromToken } from '../services/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import mockReviews from '../services/mockReviews';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ReviewsList.css';

const ReviewsList = ({ courseId, refresh, onReviewDeleted }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = getUserFromToken();
  const swiperRef = useRef(null);
  
  useEffect(() => {
    const fetchReviews = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        // Используем мок-данные вместо API-запроса
        const mockData = mockReviews[courseId] || [];
        
        // Если есть данные с сервера, использовать их
        try {
          const serverData = await getCourseReviews(courseId);
          if (serverData && serverData.length > 0) {
            setReviews(serverData);
          } else {
            // Иначе используем мок-данные
            setReviews(mockData);
          }
        } catch (err) {
          console.log('Используем мок-данные отзывов');
          setReviews(mockData);
        }
        
        setError('');
      } catch (error) {
        console.error('Ошибка при загрузке отзывов:', error);
        setError('Не удалось загрузить отзывы. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [courseId, refresh]);
  
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      return;
    }
    
    try {
      await deleteReview(reviewId);
      
      // Удаляем отзыв из локального состояния
      const updatedReviews = reviews.filter(review => review.id !== reviewId);
      setReviews(updatedReviews);
      
      // Если после удаления больше нет отзывов, обновляем родительский компонент
      if (updatedReviews.length === 0) {
        if (onReviewDeleted) {
          onReviewDeleted();
        }
        return;
      }
      
      // Обновляем Swiper после удаления отзыва
      if (swiperRef.current && swiperRef.current.swiper) {
        const swiper = swiperRef.current.swiper;
        // Перерисовываем слайдер
        setTimeout(() => {
          swiper.update();
          // Проверяем, нужно ли перейти на предыдущий слайд
          if (swiper.activeIndex >= updatedReviews.length) {
            swiper.slideTo(updatedReviews.length - 1);
          }
        }, 0);
      }
      
      // Вызываем обратный вызов для уведомления родителя
      if (onReviewDeleted) {
        onReviewDeleted();
      }
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
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          navigation={true}
          loop={reviews.length > 1}
          pagination={false}
          key={`swiper-${reviews.length}`}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: Math.min(2, reviews.length),
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: Math.min(3, reviews.length),
              spaceBetween: 30,
            },
          }}
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="review-card">
                <div className="review-header">
                  <div className="review-avatar">
                    {review.user?.name?.charAt(0) || 'С'}
                  </div>
                  <div className="review-info">
                    <div className="review-name">{review.user?.name || 'Студент'}</div>
                    <div className="review-course">{formatDate(review.createdAt)}</div>
                    <div className="review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        star <= review.rating ? '★' : '☆'
                      )).join('')}
                    </div>
                  </div>
                </div>
                <p className="review-text">{review.text}</p>
                {isAuthenticated() && (currentUser?.id === review.userId || currentUser?.role === 'ADMIN') && (
                  <button 
                    className="delete-review-btn" 
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    Удалить
                  </button>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ReviewsList; 