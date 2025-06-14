import React, { useState, useEffect } from "react";
import "./App.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import Assistant from './components/Assistant';
import UserProfile from './components/UserProfile';
import { register, login, setToken, getUserFromToken, removeToken } from './services/api';
import { Route, Routes, Link, useNavigate, BrowserRouter } from 'react-router-dom';
import CoursePage from './components/CoursePage';
import CourseLearning from './components/CourseLearning';
import ReviewsPage from './pages/ReviewsPage';
import FaqPage from './pages/FaqPage';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = getUserFromToken();
        if (userData) {
          try {
            const response = await fetch('http://localhost:3001/api/auth/user', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setUser(data.user);
            } else {
              // Если сервер вернул ошибку, но токен есть - 
              // используем данные из токена как запасной вариант
              if (userData) {
                setUser(userData);
              } else {
                removeToken();
              }
            }
          } catch (error) {
            console.error('Ошибка при проверке авторизации:', error);
            // В случае ошибки сети используем данные из токена
            if (userData) {
              setUser(userData);
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    setupSmoothScroll();
  }, []);

  const handleUserLogin = (userData) => {
    setUser(userData);
  };
  
  const handleLogout = () => {
    removeToken();
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route 
            path="/course/:id/learn" 
            element={
              <>
                <Header 
                  user={user} 
                  onAuthSuccess={handleUserLogin}
                  onLogout={handleLogout}
                  currentPage="course"
                  isLearningPage={true}
                />
                <CourseLearning />
                <Footer />
                <Assistant />
              </>
            } 
          />
          <Route 
            path="/course/:id" 
            element={
              <>
                <Header 
                  user={user} 
                  onAuthSuccess={handleUserLogin}
                  onLogout={handleLogout}
                  currentPage="course"
                />
                <CoursePage />
                <Footer />
                <Assistant />
              </>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <>
                <Header 
                  user={user} 
                  onAuthSuccess={handleUserLogin}
                  onLogout={handleLogout}
                  currentPage="profile"
                />
                <UserProfile user={user} />
                <Footer />
                <Assistant />
              </>
            } 
          />
          <Route 
            path="/reviews" 
            element={
              <>
                <Header 
                  user={user} 
                  onAuthSuccess={handleUserLogin}
                  onLogout={handleLogout}
                  currentPage="reviews"
                />
                <ReviewsPage />
                <Footer />
                <Assistant />
              </>
            } 
          />
          <Route 
            path="/faq" 
            element={
              <>
                <Header 
                  user={user} 
                  onAuthSuccess={handleUserLogin}
                  onLogout={handleLogout}
                  currentPage="faq"
                />
                <FaqPage />
                <Footer />
                <Assistant />
              </>
            } 
          />
          <Route 
            path="/" 
            element={
              <>
                <div className="hero-container">
                  <div className="hero-section">
                    <div className="hero-overlay"></div>
                    <Header 
                      user={user} 
                      onAuthSuccess={handleUserLogin}
                      onLogout={handleLogout}
                      currentPage="main"
                    />
                    <MainContent />
                  </div>
                </div>
                <DecorativeLine2 />
                <Courses />
                <Footer />
                
                <Assistant />
              </>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      if (this.getAttribute('href') === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const yOffset = -headerHeight - 20 + 100;
        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    });
  });
}

const DecorativeLine2 = () => (
  <img src="/line2.svg" alt="Line" className="line2"/>
);

export function Header({ user, onAuthSuccess, onLogout, currentPage, isLearningPage }) {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
    
    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const yOffset = -headerHeight - 20 + 260;
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        }
    };

    const handleNavigation = (sectionId) => {
        if (currentPage === 'profile' || currentPage !== 'main') {
            navigate('/#' + sectionId);
            // Добавляем небольшую задержку для корректной прокрутки после навигации
            setTimeout(() => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const yOffset = -headerHeight - 20 + 260;
                    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({
                        top: y,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        } else {
            scrollToSection(sectionId);
        }
    };
    
    const toggleAuthModal = () => {
        setShowAuthModal(!showAuthModal);
        setShowUserMenu(false);
    };
    
    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };
    
    const handleLogout = () => {
        onLogout();
        setShowUserMenu(false);
    };
    
    const handleAuthSuccess = (userData) => {
        onAuthSuccess(userData);
        setShowAuthModal(false);
    };
    
    const handleProfileClick = () => {
        console.log('Нажата кнопка профиля');
        navigate('/profile');
        setShowUserMenu(false);
    };
    
    const handleLogoClick = (e) => {
        e.preventDefault();
        if (currentPage === 'profile' || currentPage !== 'main') {
            navigate('/');
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="header">
            <div className="container">
                <div className="logo">
                    <a href="#" onClick={handleLogoClick}>
                        <span className="logo-text">KINGS COURSE</span>
                    </a>
                </div>
                {!isLearningPage && (
                <nav className="menu">
                    <ul className="menu_list">
                        <li className="menu_item">
                            <a href="#programs" onClick={(e) => { 
                                e.preventDefault();
                                handleNavigation('programs');
                            }}>Курсы</a>
                        </li>
                        <li className="menu_item">
                            <a href="/reviews" onClick={(e) => { 
                                e.preventDefault();
                                navigate('/reviews');
                            }}>Отзывы</a>
                        </li>
                        <li className="menu_item">
                            <a href="/faq" onClick={(e) => { 
                                e.preventDefault();
                                navigate('/faq');
                            }}>FAQ</a>
                        </li>
                    </ul>
                </nav>
                )}
                
                {user ? (
                    <div className="user-profile">
                        <button className="user-button" onClick={toggleUserMenu}>
                            <span className="user-name">{user.name || user.email}</span>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleProfileClick();
                                }}
                                className="user-icon"
                            >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </button>
                        
                        {showUserMenu && (
                            <div className="user-menu">
                                <div className="user-menu-item user-info">
                                    <div className="user-email">{user.email}</div>
                                    <span className="user-role">{user.role === 'STUDENT' ? 'Студент' : (user.role === 'TEACHER' ? 'Преподаватель' : 'Администратор')}</span>
                                </div>
                                <div className="user-menu-item">
                                    <button className="user-menu-button" onClick={handleProfileClick}>Личный кабинет</button>
                                </div>
                                <div className="user-menu-item">
                                    <button className="user-menu-button" onClick={handleLogout}>Выйти</button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button className="auth-button" onClick={toggleAuthModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>
                )}
            </div>
            
            {showAuthModal && (
                <AuthModal onClose={toggleAuthModal} onAuthSuccess={handleAuthSuccess} />
            )}
        </div>
    );
}

const AuthModal = ({ onClose, onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverStatus, setServerStatus] = useState(null);
    const [success, setSuccess] = useState('');

    // Проверка доступности сервера при открытии модального окна
    useEffect(() => {
        const checkServerConnection = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/health', { 
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    setServerStatus('connected');
                } else {
                    setServerStatus('error');
                }
            } catch (error) {
                console.error("Server connection error:", error);
                setServerStatus('disconnected');
            }
        };
        
        checkServerConnection();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Сбрасываем ошибку при изменении поля
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Проверяем доступность сервера перед отправкой
        if (serverStatus === 'disconnected') {
            setError('Сервер недоступен. Пожалуйста, убедитесь, что сервер запущен.');
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let response;

            if (isLogin) {
                // Процесс входа
                response = await login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                // Процесс регистрации
                response = await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role
                });
            }

            // Сохраняем токен в localStorage
            if (response && response.token) {
                setToken(response.token);
                setSuccess(isLogin ? 'Вход выполнен успешно!' : 'Регистрация выполнена успешно!');
                
                // Передаем данные пользователя в родительский компонент
                if (response.user) {
                    onAuthSuccess(response.user);
                }
                
                // Задержка перед закрытием окна для показа сообщения об успехе
                setTimeout(() => {
                    onClose();
                }, 1500);
            }
        } catch (error) {
            console.error("Ошибка авторизации:", error);
            setError(error.message || 'Произошла ошибка. Попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay" onClick={(e) => {
            if (e.target.className === 'auth-modal-overlay') onClose();
        }}>
            <div className="auth-modal">
                <div className="auth-modal-header">
                    <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
                    <button className="auth-close-btn" onClick={onClose}>×</button>
                </div>
                <div className="auth-modal-body">
                    {serverStatus === 'disconnected' && (
                        <div className="auth-error-message server-error">
                            Не удалось подключиться к серверу. Пожалуйста, убедитесь, что сервер запущен.
                        </div>
                    )}
                    
                    {error && <div className="auth-error-message">{error}</div>}
                    {success && <div className="auth-success-message">{success}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        {!isLogin ? (
                            <>
                                <div className="auth-input-group">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Ваше имя"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="auth-input-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="auth-input-group auth-role-select">
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                    >
                                        <option value="STUDENT">Студент</option>
                                        <option value="TEACHER">Преподаватель</option>
                                    </select>
                                </div>
                                <div className="auth-input-group">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Пароль"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="auth-input-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="auth-input-group">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Пароль"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </>
                        )}
                        <button 
                            type="submit" 
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                        </button>
                        <div className="auth-switch-mode">
                            <p>
                                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="auth-switch-btn"
                                    disabled={loading}
                                >
                                    {isLogin ? 'Зарегистрироваться' : 'Войти'}
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export function MainContent() {
    const scrollToOrder = () => {
        const orderSection = document.getElementById('programs');
        if (orderSection) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const yOffset = -headerHeight - 20 + 270;
            const y = orderSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        }
    };
    
    return (
        <div className="main_content" style={{ marginTop: '80px' }}>
            <div className="container">
                <div className="main-info">
                    <h1 className="main-title">Овладейте любым языком.</h1>
                    <p className="main-text">
                    Мы предлагаем эффективное обучение иностранным языкам под руководством опытных преподавателей. Наши программы разработаны с учетом современных методик и ваших индивидуальных целей. Начните свой путь к успеху уже сегодня!
                    </p>
                    <button 
                        className="button violet-button hero-button"
                        onClick={scrollToOrder}
                    >
                        Начать обучение
                    </button>
                </div>
                <div className="main-image">

                </div>
            </div>
        </div>
    );
}

export function Courses() {
    const courses = [
        {
            id: 1,
            image: "/courses-bg/eng-bg.avif",
            title: "Английский язык",
            description: "Погрузись в мир английского!",
            features: [
                "Курсы для всех уровней (A1–C2)",
                "Разговорная практика с носителями",
                "Подготовка к экзаменам (IELTS, TOEFL)"
            ],
            program: [
                {
                    title: "Начальный уровень",
                    content: [
                        "Базовая грамматика и лексика",
                        "Повседневные фразы и выражения",
                        "Основы произношения"
                    ],
                    video: "https://www.youtube.com/embed/VdIjQGYNBK8"
                },
                {
                    title: "Продвинутый уровень",
                    content: [
                        "Сложные грамматические конструкции",
                        "Деловой английский и переговоры",
                        "Подготовка к международным экзаменам"
                    ],
                    video: "https://www.youtube.com/embed/LZNcVz7cV2A"
                }
            ]
        },
        {
            id: 2,
            image: "/courses-bg/ger-bg.avif",
            title: "Немецкий язык",
            description: "Открой для себя язык Гёте!",
            features: [
                "Грамматика и произношение с нуля",
                "Подготовка к Goethe-Zertifikat",
                "Бизнес-немецкий и путешествия"
            ],
            program: [
                {
                    title: "Базовый курс",
                    content: [
                        "Немецкий алфавит и произношение",
                        "Основные фразы и выражения",
                        "Простые грамматические конструкции"
                    ],
                    video: "https://www.youtube.com/embed/rd56GFcGMvQ"
                },
                {
                    title: "Продвинутый курс",
                    content: [
                        "Сложная грамматика (времена, склонения)",
                        "Разговорная практика и диалоги",
                        "Чтение и анализ немецких текстов"
                    ],
                    video: "https://www.youtube.com/embed/YFP7q_Rw3p8"
                }
            ]
        },
        {
            id: 3,
            image: "/courses-bg/fr-bg.avif",
            title: "Французский язык",
            description: "Говори, как парижанин!",
            features: [
                "Французский с нуля до продвинутого уровня",
                "Подготовка к DELF/DALF",
                "Разговорные клубы и интерактивные уроки"
            ],
            program: [
                {
                    title: "Вводный курс",
                    content: [
                        "Фонетика и произношение",
                        "Базовый словарный запас",
                        "Простые грамматические структуры"
                    ],
                    video: "https://www.youtube.com/embed/7gG0zi9gdlA"
                },
                {
                    title: "Профессиональный курс",
                    content: [
                        "Бизнес-французский",
                        "Подготовка к экзаменам DELF/DALF",
                        "Перевод и интерпретация"
                    ],
                    video: "https://www.youtube.com/embed/mZ16sVJ-nAA"
                }
            ]
        },
        {
            id: 4,
            image: "/courses-bg/esp-bg.avif",
            title: "Испанский язык",
            description: "Почувствуй страсть Испании!",
            features: [
                "Латинская Америка vs Испания",
                "Подготовка к DELE",
                "Сленг и культура испаноязычных стран"
            ],
            program: [
                {
                    title: "Уровень A1-A2",
                    content: [
                        "Основы испанской грамматики",
                        "Базовые разговорные фразы",
                        "Испанское произношение"
                    ],
                    video: "https://www.youtube.com/embed/jzNC_ZdE7N0"
                },
                {
                    title: "Уровень B1-C2",
                    content: [
                        "Углубленная грамматика",
                        "Разговорная практика",
                        "Деловой испанский и подготовка к DELE"
                    ],
                    video: "https://www.youtube.com/embed/CupnpvL7j5A"
                }
            ]
        },
        {
            id: 5,
            image: "/courses-bg/italy-bg.avif",
            title: "Итальянский язык",
            description: "Говори, как в Италии!",
            features: [
                "Итальянский для путешествий",
                "Музыка и кино на итальянском",
                "Культура и традиции Италии"
            ],
            program: [
                {
                    title: "Начальный уровень",
                    content: [
                        "Базовая грамматика и лексика",
                        "Итальянское произношение",
                        "Простые диалоги"
                    ],
                    video: "https://www.youtube.com/embed/Y3UB9EsJSsw"
                },
                {
                    title: "Продвинутый уровень",
                    content: [
                        "Сложные грамматические конструкции",
                        "Итальянская литература и кино",
                        "Деловой итальянский"
                    ],
                    video: "https://www.youtube.com/embed/AY2sYlLrGFk"
                }
            ]
        }
    ];

    const navigate = useNavigate();
    
    useEffect(() => {
        document.querySelectorAll('.course-card.with-bg').forEach(card => {
            const bgImage = card.getAttribute('data-bg');
            if (bgImage) {
                card.style.setProperty('--bg-image', `url(${bgImage})`);
                card.querySelector('.course-details').style.position = 'relative';
                card.querySelector('.course-details').style.zIndex = '2';
            }
        });
    }, []);

    return (
        <>
            <section className="courses" id="programs">
                <div className="common-title">Выберите программу</div>
                <div className="container">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        slidesPerView={3}
                        spaceBetween={40}
                        loop={true}
                        navigation={true}
                        pagination={false}
                        className="swiper"
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                            },
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            }
                        }}
                    >
                        {courses.map((course) => (
                            <SwiperSlide key={course.id}>
                                <div 
                                    className="course-card with-bg" 
                                    data-bg={course.image}
                                    onClick={() => navigate(`/course/${course.id}`)}
                                >
                                    <div className="course-details">
                                        <h3 className="course-title">{course.title}</h3>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        </>
    );
}

export function Reviews() {
    const reviews = [
        {
            id: 1,
            initial: "А",
            name: "Алексей",
            course: "Английский язык",
            rating: "★★★★★",
            text: "Замечательная школа! Всего за 6 месяцев я смог выучить английский до уровня, позволяющего свободно общаться с иностранными коллегами."
        },
        {
            id: 2,
            initial: "М",
            name: "Мария",
            course: "Итальянский язык",
            rating: "★★★★★",
            text: "Преподаватели-носители языка делают занятия очень интересными и эффективными. Погружение в культуру помогает лучше понимать язык."
        },
        {
            id: 3,
            initial: "Д",
            name: "Дмитрий",
            course: "Японский язык",
            rating: "★★★★☆",
            text: "Отличная методика обучения японскому языку. За год освоил базовую грамматику и выучил более 1000 иероглифов. Рекомендую!"
        },
        {
            id: 4,
            initial: "Е",
            name: "Екатерина",
            course: "Французский язык",
            rating: "★★★★★",
            text: "Прекрасные преподаватели и удобная платформа. Занималась французским всего 4 месяца и уже могу читать книги и смотреть фильмы с субтитрами."
        },
        {
            id: 5,
            initial: "С",
            name: "Сергей",
            course: "Немецкий язык",
            rating: "★★★★☆",
            text: "Удобное расписание и индивидуальный подход. Преподаватель всегда подстраивается под мой уровень и темп обучения."
        },
        {
            id: 6,
            initial: "О",
            name: "Ольга",
            course: "Испанский язык",
            rating: "★★★★★",
            text: "После курса испанского смогла свободно общаться во время поездки в Барселону. Отличная практика разговорной речи!"
        }
    ];

    return (
        <div className="reviews" id="reviews">
            <div className="container">
                <h2 className="common-title">Отзывы наших студентов</h2>
                <div className="description">
                Узнайте, что говорят о нас те, кто уже учится в Kings Course. Реальные истории успеха наших студентов.
                </div>
                <div className="reviews-container">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        slidesPerView={1}
                        navigation={true}
                        loop={true}
                        pagination={false}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 25,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                        }}
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review.id}>
                                <div className="review-card">
                                    <div className="review-header">
                                        <div className="review-avatar">{review.initial}</div>
                                        <div className="review-info">
                                            <div className="review-name">{review.name}</div>
                                            <div className="review-course">{review.course}</div>
                                            <div className="review-rating">{review.rating}</div>
                                        </div>
                                    </div>
                                    <p className="review-text">{review.text}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}


export function FAQ() {
    const [openItem, setOpenItem] = useState(null);
    
    const toggleItem = (index) => {
        setOpenItem(openItem === index ? null : index);
    };
    
    const faqItems = [
        {
            question: "Как проходят занятия?",
            answer: "Занятия проходят в формате онлайн-вебинаров с преподавателем. Вы можете заниматься из любой точки мира, где есть интернет."
        },
        {
            question: "Сколько длится один уровень обучения?",
            answer: "Один уровень обучения в среднем занимает 3-4 месяца при регулярных занятиях 2-3 раза в неделю."
        },
        {
            question: "Могу ли я поменять преподавателя?",
            answer: "Да, если вам не подходит стиль преподавания, вы можете запросить смену преподавателя в любое время."
        },
        {
            question: "Какие языки можно изучать?",
            answer: "В нашей школе вы можете изучать английский, немецкий, французский, испанский, итальянский, китайский и японский языки."
        },
        {
            question: "Есть ли возврат средств, если курс не понравится?",
            answer: "Да, в течение первой недели обучения вы можете вернуть деньги, если курс вам не подходит."
        }
    ];
    
    return (
        <div className="faq">
            <div className="container">
                <h2 className="common-title">Часто задаваемые вопросы</h2>
                <div className="faq-items">
                    {faqItems.map((item, index) => (
                        <div key={index} className={`faq-item ${openItem === index ? 'open' : ''}`}>
                            <button className="faq-question" onClick={() => toggleItem(index)}>
                                {item.question}
                                <span className="arrow">▼</span>
                            </button>
                            <div 
                                className="faq-answer" 
                                style={{ 
                                    maxHeight: openItem === index ? '100px' : '0',
                                    padding: openItem === index ? '10px' : '0 10px',
                                    opacity: openItem === index ? 1 : 0
                                }}
                            >
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function Footer() {
    return (
        <div className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-text">LANGUAGE SCHOOL</div>
                </div>
                <div className="rights">© 2025 Все права защищены</div>
            </div>
        </div>
    );
}

export default App;

