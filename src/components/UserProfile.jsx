import React, { useState, useEffect } from 'react';
import { getEnrollments, getUserFromToken } from '../services/api';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';

function UserProfile({ user }) {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(user || {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        

        if (!user) {
          const userData = getUserFromToken();
          if (userData) {
            setCurrentUser(userData);
          } else {
            navigate('/');
            return;
          }
        }

        const enrollmentsData = await getEnrollments();
        setEnrollments(enrollmentsData || []);
      } catch (err) {
        setError('Ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
        console.error('Ошибка при загрузке данных профиля:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, navigate]);

  const handleChooseCourse = () => {
    navigate('/#programs');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  return (
    <div className="profile-page">
      <div className="profile-page-content">
        <div className="container">
          <h1 className="profile-title">Личный кабинет</h1>
          
          {loading ? (
            <div className="profile-loading">
              <div className="profile-loading-spinner"></div>
              <p>Загрузка данных...</p>
            </div>
          ) : error ? (
            <div className="profile-error">
              <p>{error}</p>
              <button className="profile-button" onClick={() => navigate('/')}>На главную</button>
            </div>
          ) : (
            <div className="profile-content">
              <div className="profile-info">
                <div className="profile-avatar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="profile-details">
                  <h3>{currentUser.name || 'Пользователь'}</h3>
                  <p className="profile-email">{currentUser.email}</p>
                  <p className="profile-role">
                    {currentUser.role === 'STUDENT' ? 'Студент' : 
                     currentUser.role === 'TEACHER' ? 'Преподаватель' : 'Администратор'}
                  </p>
                </div>
              </div>
              
              <div className="profile-section">
                <h3>Мои курсы</h3>
                {enrollments.length === 0 ? (
                  <div className="no-enrollments">
                    <p>У вас пока нет записей на курсы</p>
                    <button className="profile-button" onClick={handleChooseCourse}>Выбрать курс</button>
                  </div>
                ) : (
                  <div className="enrollments-list">
                    {enrollments.map((enrollment) => (
                      <div key={enrollment.id} className="enrollment-item">
                        <div className="enrollment-course">
                          <img 
                            src={enrollment.course.imageUrl || "/course-default.jpg"} 
                            alt={enrollment.course.title} 
                            className="enrollment-image"
                          />
                          <div className="enrollment-details">
                            <h4>{enrollment.course.title}</h4>
                            <p className="enrollment-date">
                              Дата записи: {formatDate(enrollment.createdAt)}
                            </p>
                            <p className="enrollment-status">
                              Статус: <span className={`status-${enrollment.status.toLowerCase()}`}>
                                {enrollment.status === 'ACTIVE' ? 'Активный' : 
                                 enrollment.status === 'COMPLETED' ? 'Завершен' : 'В ожидании'}
                              </span>
                            </p>
                          </div>
                        </div>
                        <a 
                          href="#programs" 
                          className="course-link"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/course/${enrollment.courseId}/learn`);
                          }}
                        >
                          Продолжить обучение
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile; 