import React, { useState, useEffect } from 'react';
import { getEnrollments, getUserFromToken, isAdmin, getAllUsers, getUserEnrollments, deleteUser } from '../services/api';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';

function UserProfile({ user }) {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(user || {});
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [loadingAdminData, setLoadingAdminData] = useState(false);
  const [deleteConfirmUserId, setDeleteConfirmUserId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        

        if (!user) {
          const userData = getUserFromToken();
          if (userData) {
            setCurrentUser(userData);
            const adminStatus = isAdmin();
            setIsAdminUser(adminStatus);
            
            // Загружаем данные об обычных записях пользователя
            const enrollmentsData = await getEnrollments();
            setEnrollments(enrollmentsData || []);
            
            // Если пользователь админ, загружаем список всех пользователей
            if (adminStatus) {
              await fetchAdminData();
            }
          } else {
            navigate('/');
            return;
          }
        } else {
          setIsAdminUser(user.role === 'ADMIN');
          
          // Загружаем данные об обычных записях пользователя
          const enrollmentsData = await getEnrollments();
          setEnrollments(enrollmentsData || []);
          
          // Если пользователь админ, загружаем список всех пользователей
          if (user.role === 'ADMIN') {
            await fetchAdminData();
          }
        }
      } catch (err) {
        setError('Ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
        console.error('Ошибка при загрузке данных профиля:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, navigate]);

  const fetchAdminData = async () => {
    setLoadingAdminData(true);
    try {
      const usersData = await getAllUsers();
      setAllUsers(usersData || []);
      setLoadingAdminData(false);
    } catch (error) {
      console.error('Ошибка при загрузке данных администратора:', error);
      setLoadingAdminData(false);
    }
  };

  const handleViewUserEnrollments = async (userId) => {
    setLoadingAdminData(true);
    try {
      const enrollmentsData = await getUserEnrollments(userId);
      setUserEnrollments(enrollmentsData || []);
      const userData = allUsers.find(u => u.id === userId);
      setSelectedUser(userData);
      setLoadingAdminData(false);
    } catch (error) {
      console.error('Ошибка при загрузке записей пользователя:', error);
      setLoadingAdminData(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setDeleteConfirmUserId(userId);
  };

  const confirmDeleteUser = async () => {
    if (!deleteConfirmUserId) return;
    
    setDeleting(true);
    try {
      await deleteUser(deleteConfirmUserId);
      // Обновляем список пользователей после удаления
      await fetchAdminData();
      setDeleteConfirmUserId(null);
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDeleteUser = () => {
    setDeleteConfirmUserId(null);
  };

  const handleChooseCourse = () => {
    navigate('/#programs');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Компонент для отображения админской панели
  const AdminPanel = () => {
    return (
      <div className="admin-panel">
        <div className="admin-content">
          {loadingAdminData ? (
            <div className="admin-loading">Загрузка данных...</div>
          ) : (
            <div className="admin-users">
              {selectedUser ? (
                <div className="user-enrollments-view">
                  <button 
                    className="back-to-users"
                    onClick={() => setSelectedUser(null)}
                  >
                    ← Назад к списку пользователей
                  </button>
                  
                  <h3>Курсы пользователя {selectedUser.name || selectedUser.email}</h3>
                  
                  {userEnrollments.length === 0 ? (
                    <p>Пользователь не записан ни на один курс</p>
                  ) : (
                    <div className="admin-enrollments-list">
                      {userEnrollments.map(enrollment => (
                        <div key={enrollment.id} className="admin-enrollment-item">
                          <div className="enrollment-course">
                            <img 
                              src={enrollment.course?.imageUrl || "/course-default.jpg"} 
                              alt={enrollment.course?.title} 
                              className="enrollment-image"
                            />
                            <div className="enrollment-details">
                              <h4>{enrollment.course?.title}</h4>
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <h3>Список пользователей</h3>
                  
                  {deleteConfirmUserId && (
                    <div className="delete-confirmation">
                      <p>Вы уверены, что хотите удалить этого пользователя? Это действие невозможно отменить.</p>
                      <div className="confirm-actions">
                        <button 
                          className="confirm-btn delete-btn" 
                          onClick={confirmDeleteUser}
                          disabled={deleting}
                        >
                          {deleting ? 'Удаление...' : 'Да, удалить'}
                        </button>
                        <button 
                          className="confirm-btn cancel-btn" 
                          onClick={cancelDeleteUser}
                          disabled={deleting}
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="users-list">
                    {allUsers.map(user => (
                      <div key={user.id} className="user-item">
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.name?.charAt(0) || user.email.charAt(0)}
                          </div>
                          <div className="user-details">
                            <h4>{user.name || 'Пользователь'}</h4>
                            <p className="user-email">{user.email}</p>
                            <p className="user-role">
                              {user.role === 'STUDENT' ? 'Студент' : 
                              user.role === 'TEACHER' ? 'Преподаватель' : 'Администратор'}
                            </p>
                          </div>
                        </div>
                        <div className="user-actions">
                          <button 
                            className="view-enrollments-btn"
                            onClick={() => handleViewUserEnrollments(user.id)}
                          >
                            Просмотреть курсы
                          </button>
                          {user.role !== 'ADMIN' && (
                            <button 
                              className="delete-user-btn"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Удалить
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="profile-page">
      <div className="profile-page-content">
        <div className="container">
          <h1 className="profile-title">
            {isAdminUser ? 'Панель администратора' : 'Личный кабинет'}
          </h1>
          
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
              
              {isAdminUser ? (
                <AdminPanel />
              ) : (
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile; 