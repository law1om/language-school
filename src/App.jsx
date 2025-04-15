import React, { useState, useEffect } from "react";
import "./App.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import Assistant from './components/Assistant';
import { register, login, setToken, isAuthenticated, getUserFromToken, removeToken } from './services/api';


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

export function PromoBanner() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 9,
        minutes: 50,
        seconds: 40
    });
    
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                let { hours, minutes, seconds } = prevTime;
                



                if (seconds > 0) {
                    seconds -= 1;
                } else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes -= 1;
                    } else {
                        minutes = 59;
                        if (hours > 0) {
                            hours -= 1;
                        } else {
                            clearInterval(timer);
                            return { hours: 0, minutes: 0, seconds: 0 };
                        }
                    }
                }
                
                return { hours, minutes, seconds };
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);
    
    const formatTime = (value) => {
        return value < 10 ? `0${value}` : value;
    };
    
    const scrollToCourse = () => {
        const coursesSection = document.getElementById('programs');
        if (coursesSection) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const yOffset = -headerHeight - 20 + 260;
            const y = coursesSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        }
    };
    
    return (
        <div className="promo-banner">
            <div className="promo-banner-inner">
                <img src="/banner/left-icon.png" alt="" className="promo-icon-left"/>
                <div className="promo-text">
                    Вдохновляем скидками до 55%
                </div>
                <img src="/banner/sale-sa.png" alt="Promo Icon Right" className="promo-icon"/>
                <div className="promo-right-block">
                    <button className="promo-button" onClick={() => scrollToCourse()}>
                        Выбрать курс
                    </button>
                    <div className="promo-timer">
                        <span className="timer-label">До конца акции: </span>
                        <span className="timer-value">
                            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
}

export function Header() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Получение данных пользователя при загрузке
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
                            // Если токен недействителен, удаляем его
                            removeToken();
                        }
                    } catch (error) {
                        console.error('Ошибка при проверке авторизации:', error);
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };
        
        checkAuth();
    }, []);
    
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
    
    const toggleAuthModal = () => {
        setShowAuthModal(!showAuthModal);
        setShowUserMenu(false);
    };
    
    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };
    
    const handleLogout = () => {
        removeToken();
        setUser(null);
        setShowUserMenu(false);
        window.location.reload();
    };
    
    const handleAuthSuccess = (userData) => {
        setUser(userData);
        setShowAuthModal(false);
    };
    
    return (
        <div className="header">
            <div className="container">
                <div className="logo">
                    <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <span className="logo-text">KINGS COURSE</span>
                    </a>
                </div>
                <nav className="menu">
                    <ul className="menu_list">
                        <li className="menu_item"><a href="#programs" onClick={(e) => { e.preventDefault(); scrollToSection('programs'); }}>Курсы</a></li>
                        <li className="menu_item"><a href="#reviews" onClick={(e) => { e.preventDefault(); scrollToSection('reviews'); }}>Отзывы</a></li>
                        <li className="menu_item"><a href="#order" onClick={(e) => { e.preventDefault(); scrollToSection('order'); }}>Записаться</a></li>
                    </ul>
                </nav>
                
                {isLoading ? (
                    <div className="auth-loading">
                        <div className="auth-loading-spinner"></div>
                    </div>
                ) : user ? (
                    <div className="user-profile">
                        <button className="user-button" onClick={toggleUserMenu}>
                            <span className="user-name">{user.name || user.email}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="main_content">
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
                    ]
                },
                {
                    title: "Средний уровень",
                    content: [
                        "Углубленная грамматика (времена, пассивный залог)",
                        "Разговорные клубы и дискуссии",
                        "Аудирование и понимание речи носителей"
                    ]
                },
                {
                    title: "Продвинутый уровень",
                    content: [
                        "Сложные грамматические конструкции",
                        "Деловой английский и переговоры",
                        "Подготовка к международным экзаменам"
                    ]
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
                    ]
                },
                {
                    title: "Продвинутый курс",
                    content: [
                        "Сложная грамматика (времена, склонения)",
                        "Разговорная практика и диалоги",
                        "Чтение и анализ немецких текстов"
                    ]
                },
                {
                    title: "Специализированный курс",
                    content: [
                        "Деловой немецкий",
                        "Медицинский немецкий",
                        "Подготовка к экзаменам"
                    ]
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
                    ]
                },
                {
                    title: "Основной курс",
                    content: [
                        "Времена и наклонения",
                        "Повседневные диалоги и ситуации",
                        "Французская культура и традиции"
                    ]
                },
                {
                    title: "Профессиональный курс",
                    content: [
                        "Бизнес-французский",
                        "Подготовка к экзаменам DELF/DALF",
                        "Перевод и интерпретация"
                    ]
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
                    ]
                },
                {
                    title: "Уровень B1-B2",
                    content: [
                        "Углубленная грамматика",
                        "Разговорная практика",
                        "Различия между испанским Испании и Латинской Америки"
                    ]
                },
                {
                    title: "Уровень C1-C2",
                    content: [
                        "Изучение сложных конструкций",
                        "Деловой испанский",
                        "Подготовка к экзамену DELE"
                    ]
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
                    ]
                },
                {
                    title: "Средний уровень",
                    content: [
                        "Времена и наклонения",
                        "Разговорная практика",
                        "Итальянская культура и традиции"
                    ]
                },
                {
                    title: "Продвинутый уровень",
                    content: [
                        "Сложные грамматические конструкции",
                        "Итальянская литература и кино",
                        "Деловой итальянский"
                    ]
                }
            ]
        },
        {
            id: 6,
            image: "/courses-bg/japon-bg.avif",
            title: "Японский язык",
            description: "Погрузись в культуру Японии!",
            features: [
                "Японский язык с носителями",
                "Подготовка к JLPT (N5–N1)",
                "Разговорная практика и чтение манги"
            ],
            program: [
                {
                    title: "Хирагана и Катакана",
                    content: [
                        "Изучение японских азбук",
                        "Базовые фразы и выражения",
                        "Основы грамматики"
                    ]
                },
                {
                    title: "Кандзи и грамматика",
                    content: [
                        "Изучение базовых иероглифов",
                        "Расширенная грамматика",
                        "Разговорная практика"
                    ]
                },
                {
                    title: "Продвинутый японский",
                    content: [
                        "Сложные иероглифы и выражения",
                        "Подготовка к JLPT",
                        "Изучение японской культуры"
                    ]
                }
            ]
        },
        {
            id: 7,
            image: "/courses-bg/china-bg.avif",
            title: "Китайский язык",
            description: "Откройте для себя язык будущего!",
            features: [
                "Изучение иероглифов с нуля",
                "Подготовка к HSK (1-6)",
                "Бизнес-китайский и культура Китая"
            ],
            program: [
                {
                    title: "Базовый китайский",
                    content: [
                        "Китайская фонетика и тоны",
                        "Базовые иероглифы",
                        "Простые разговорные фразы"
                    ]
                },
                {
                    title: "Средний уровень",
                    content: [
                        "Расширенный словарный запас",
                        "Грамматические конструкции",
                        "Разговорная практика"
                    ]
                },
                {
                    title: "Продвинутый курс",
                    content: [
                        "Сложные иероглифы и выражения",
                        "Деловой китайский",
                        "Подготовка к HSK 5-6"
                    ]
                }
            ]
        },
        {
            id: 8,
            image: "/courses-bg/korea-bg.avif",
            title: "Корейский язык",
            description: "Погрузитесь в K-culture!",
            features: [
                "Корейский алфавит и грамматика",
                "Подготовка к TOPIK",
                "K-pop и корейские сериалы"
            ],
            program: [
                {
                    title: "Хангыль (корейский алфавит)",
                    content: [
                        "Изучение корейского алфавита",
                        "Базовое произношение",
                        "Простые фразы"
                    ]
                },
                {
                    title: "Базовая грамматика",
                    content: [
                        "Основные грамматические конструкции",
                        "Расширение словарного запаса",
                        "Повседневные диалоги"
                    ]
                },
                {
                    title: "Продвинутый корейский",
                    content: [
                        "Сложная грамматика",
                        "Подготовка к TOPIK",
                        "Изучение корейской культуры"
                    ]
                }
            ]
        },
        {
            id: 9,
            image: "/courses-bg/arab-bg.avif",
            title: "Арабский язык",
            description: "Изучите язык Ближнего Востока!",
            features: [
                "Арабский алфавит и каллиграфия",
                "Диалекты арабского мира",
                "Культура и традиции арабских стран"
            ],
            program: [
                {
                    title: "Арабский алфавит",
                    content: [
                        "Изучение арабских букв",
                        "Основы каллиграфии",
                        "Базовое произношение"
                    ]
                },
                {
                    title: "Базовая грамматика",
                    content: [
                        "Грамматические структуры",
                        "Базовые разговорные фразы",
                        "Различия между диалектами"
                    ]
                },
                {
                    title: "Продвинутый уровень",
                    content: [
                        "Сложная грамматика",
                        "Современный стандартный арабский",
                        "Арабская литература и СМИ"
                    ]
                }
            ]
        },
        {
            id: 10,
            image: "/courses-bg/portugal-bg.avif",
            title: "Португальский язык",
            description: "Откройте мир лузофонии!",
            features: [
                "Португальский Португалии и Бразилии",
                "Подготовка к CAPLE",
                "Культура португалоязычных стран"
            ],
            program: [
                {
                    title: "Начальный уровень",
                    content: [
                        "Базовая лексика и грамматика",
                        "Португальское произношение",
                        "Простые диалоги"
                    ]
                },
                {
                    title: "Средний уровень",
                    content: [
                        "Углубленная грамматика",
                        "Различия между португальским Португалии и Бразилии",
                        "Разговорная практика"
                    ]
                },
                {
                    title: "Продвинутый уровень",
                    content: [
                        "Сложные грамматические конструкции",
                        "Деловой португальский",
                        "Подготовка к CAPLE"
                    ]
                }
            ]
        }
    ];

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState([]);
    
    const handleCardClick = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
        setExpandedSections([]);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
    };
    
    const toggleSection = (index) => {
        setExpandedSections(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };
    
    const scrollToOrder = () => {
        const orderSection = document.getElementById('order');
        if (orderSection) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const yOffset = -headerHeight - 20 + 270;
            const y = orderSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
            closeModal();
            
            if (selectedCourse && window.setCourseInOrderForm) {
                window.setCourseInOrderForm(selectedCourse.title);
            }
        }
    };

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
                                onClick={() => handleCardClick(course)}
                            >
                                <div className="course-details">
                                    <h3 className="course-title">{course.title}</h3>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            
            {isModalOpen && selectedCourse && (
                <div className="course-modal-overlay" onClick={closeModal}>
                    <div className="course-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="course-modal-header">
                            <button className="modal-close-btn modal-close-left" onClick={closeModal}>×</button>
                            <h3>{selectedCourse.title}</h3>
                            <div className="modal-header-space"></div>
                        </div>
                        <div className="course-modal-body">
                            <p className="course-description">{selectedCourse.description}</p>
                            
                            <div className="course-program">
                                <h4>Программа курса:</h4>
                                <div className="program-accordion">
                                    {selectedCourse.program.map((section, index) => (
                                        <div key={index} className="program-section">
                                            <div 
                                                className={`program-header ${expandedSections.includes(index) ? 'expanded' : ''}`}
                                                onClick={() => toggleSection(index)}
                                            >
                                                <h5>{section.title}</h5>
                                                <span className="accordion-icon">
                                                    {expandedSections.includes(index) ? '−' : '+'}
                                                </span>
                                            </div>
                                            <div className={`program-content ${expandedSections.includes(index) ? 'expanded' : ''}`}>
                                                <ul>
                                                    {section.content.map((item, itemIndex) => (
                                                        <li key={itemIndex}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <button 
                                className="button violet-button"
                                onClick={scrollToOrder}
                            >
                                Записаться на курс
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
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

export function OrderForm() {
    const [formData, setFormData] = useState({
        course: '',
        name: '',
        phone: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        window.setCourseInOrderForm = (courseName) => {
            setFormData(prev => ({ ...prev, course: courseName }));
        };
        
        return () => {
            window.setCourseInOrderForm = null;
        };
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    const validateForm = () => {
        let formErrors = {};
        let isValid = true;
        
        if (!formData.course.trim()) {
            formErrors.course = 'Выберите курс';
            isValid = false;
        }

        if (!formData.name.trim()) {
            formErrors.name = 'Введите имя';
            isValid = false;
        }
        
        if (!formData.phone.trim()) {
            formErrors.phone = 'Введите телефон';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            formErrors.phone = 'Некорректный телефон';
            isValid = false;
        }
        
        setErrors(formErrors);
        return isValid;
    };
    
    const saveFormDataToJson = (data) => {
       
        const existingData = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        
       
        const newSubmission = {
            ...data,
            submittedAt: new Date().toISOString(),
            id: Date.now() 
        };
        
        
        existingData.push(newSubmission);
        
        
        localStorage.setItem('formSubmissions', JSON.stringify(existingData));
        
        console.log('Данные сохранены в localStorage:', newSubmission);
        return newSubmission;
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);
            
            
            const submissionData = {
                course: formData.course,
                name: formData.name,
                phone: '+7' + formData.phone
            };
            
            setTimeout(() => {
                
                const savedData = saveFormDataToJson(submissionData);
                
                console.log('Form submitted:', savedData);
                alert('Заявка успешно отправлена и сохранена!');
                setFormData({ course: '', name: '', phone: '' });
                setIsSubmitting(false);
            }, 1500);
        }
    };
    
    return (
        <div className="order" id="order">
            <div className="container">
                <h2 className="common-title">Запишитесь на обучение</h2>
                <div className="order-block">
                    <div className="order-form">
                        <div className="order-form-text">
                            Оставьте заявку и наш менеджер свяжется с вами в ближайшее время
                        </div>
                        <form className="order-form-inputs" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <select
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    className={errors.course ? 'error' : ''}
                                >
                                    <option value="">Выберите курс</option>
                                    <option value="Английский язык">Английский язык</option>
                                    <option value="Немецкий язык">Немецкий язык</option>
                                    <option value="Французский язык">Французский язык</option>
                                    <option value="Испанский язык">Испанский язык</option>
                                    <option value="Итальянский язык">Итальянский язык</option>
                                    <option value="Японский язык">Японский язык</option>
                                    <option value="Китайский язык">Китайский язык</option>
                                    <option value="Корейский язык">Корейский язык</option>
                                    <option value="Арабский язык">Арабский язык</option>
                                    <option value="Португальский язык">Португальский язык</option>
                                </select>
                                {errors.course && <div className="error-message">{errors.course}</div>}
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Ваше имя"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={errors.name ? 'error' : ''}
                                    autoComplete="off"
                                />
                                {errors.name && <div className="error-message">{errors.name}</div>}
                            </div>
                            <div className="input-group phone-input-group">
                                <div className="phone-input-container">
                                    <span className="phone-prefix">+7</span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="(777) 123-45-67"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={errors.phone ? 'error' : ''}
                                        autoComplete="off"
                                    />
                                </div>
                                {errors.phone && <div className="error-message">{errors.phone}</div>}
                            </div>
                            <button 
                                type="submit" 
                                className="button violet-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Отправка...' : 'Записаться на обучение'}
                            </button>
                        </form>
                    </div>
                    <div className="order-image">
                        <img src="/books.svg" alt="Книги" />
                    </div>
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

export function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        
        window.addEventListener('scroll', toggleVisibility);
        
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    return (
        <>
            {isVisible && (
                <button 
                    className="scroll-top" 
                    onClick={scrollToTop}
                    aria-label="Прокрутить наверх"
                >
                    ↑
                </button>
            )}
        </>
    );
}

