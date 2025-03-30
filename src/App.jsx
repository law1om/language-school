import React, { useState, useEffect } from "react";
import "./App.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Вынесем линию в корневой компонент для избежания проблем с контейнерами
const DecorativeLine2 = () => (
  <img src="/line2.svg" alt="Line" className="line2"/>
);

export function PromoBanner() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 10,
        minutes: 26,
        seconds: 32
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
    
    const scrollToForm = () => {
        const form = document.querySelector('.order');
        form?.scrollIntoView({ behavior: 'smooth' });
    };
    
    return (
        <div className="promo-banner">
            <div className="promo-banner-inner">
                <div className="promo-text">
                    Вдохновляем скидками до 55%
                </div>
                <div className="promo-right-block">
                    <div className="promo-timer">
                        <span className="timer-label">До конца акции:</span>
                        <span className="timer-value">
                            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                        </span>
                    </div>
                    <button className="promo-button" onClick={() => scrollToForm()}>
                        Выбрать курс
                    </button>
                </div>
            </div>
        </div>
    );
}

export function Header() {
    return (
        <div className="header">
            <div className="container">
                <div className="logo">
                    <a href="#">
                        <span className="logo-text">KINGS COURSE</span>
                    </a>
                </div>
                <nav className="menu">
                    <ul className="menu_list">
                        
                        <li className="menu_item"><a href="#">Курсы</a></li>
                        <li className="menu_item"><a href="#">Отзывы</a></li>
                        <li className="menu_item"><a href="#">Записаться</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export function MainContent() {
    return (
        <div className="main_content">
            <div className="container">
                <img src="/line1.svg" alt="Line" className="line1"/>
                <div className="main-info">
                    <h1 className="main-title">Овладейте любым языком.</h1>
                    <p className="main-text">
                        Эффективные программы для изучения иностранных языков с нуля
                        до продвинутого уровня. Интерактивные занятия с преподавателями-
                        носителями языка.
                    </p>
                </div>
                <div className="main-image">
                    <img src="/foreign-language.svg" alt="Изучение языков" />
                </div>
            </div>
        </div>
    );
}

export function Courses() {
    const courses = [
        {
            id: 1,
            image: "/eng.png",
            title: "Английский язык",
            description: "Погрузись в мир английского!",
            features: [
                "Курсы для всех уровней (A1–C2)",
                "Разговорная практика с носителями",
                "Подготовка к экзаменам (IELTS, TOEFL)"
            ]
        },
        {
            id: 2,
            image: "/ger 1.svg",
            title: "Немецкий язык",
            description: "Открой для себя язык Гёте!",
            features: [
                "Грамматика и произношение с нуля",
                "Подготовка к Goethe-Zertifikat",
                "Бизнес-немецкий и путешествия"
            ]
        },
        {
            id: 3,
            image: "/fr.svg",
            title: "Французский язык",
            description: "Говори, как парижанин!",
            features: [
                "Французский с нуля до продвинутого уровня",
                "Подготовка к DELF/DALF",
                "Разговорные клубы и интерактивные уроки"
            ]
        },
        {
            id: 4,
            image: "/es 1.svg",
            title: "Испанский язык",
            description: "Почувствуй страсть Испании!",
            features: [
                "Латинская Америка vs Испания",
                "Подготовка к DELE",
                "Сленг и культура испаноязычных стран"
            ]
        },
        {
            id: 5,
            image: "/italy.png",
            title: "Итальянский язык",
            description: "Говори, как в Италии!",
            features: [
                "Итальянский для путешествий",
                "Музыка и кино на итальянском",
                "Культура и традиции Италии"
            ]
        },
        {
            id: 6,
            image: "/jap.svg",
            title: "Японский язык",
            description: "Погрузись в культуру Японии!",
            features: [
                "Японский язык с носителями",
                "Подготовка к JLPT (N5–N1)",
                "Разговорная практика и чтение манги"
            ]
        },
        {
            id: 7,
            image: "/china.svg",
            title: "Китайский язык",
            description: "Откройте для себя язык будущего!",
            features: [
                "Изучение иероглифов с нуля",
                "Подготовка к HSK (1-6)",
                "Бизнес-китайский и культура Китая"
            ]
        },
        {
            id: 8,
            image: "/korea.svg",
            title: "Корейский язык",
            description: "Погрузитесь в K-culture!",
            features: [
                "Корейский алфавит и грамматика",
                "Подготовка к TOPIK",
                "K-pop и корейские сериалы"
            ]
        },
        {
            id: 9,
            image: "/arabic.svg",
            title: "Арабский язык",
            description: "Изучите язык Ближнего Востока!",
            features: [
                "Арабский алфавит и каллиграфия",
                "Диалекты арабского мира",
                "Культура и традиции арабских стран"
            ]
        },
        {
            id: 10,
            image: "/portugal.svg",
            title: "Португальский язык",
            description: "Откройте мир лузофонии!",
            features: [
                "Португальский Португалии и Бразилии",
                "Подготовка к CAPLE",
                "Культура португалоязычных стран"
            ]
        }
    ];

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
                    pagination={{
                        clickable: true
                    }}
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
                            <div className="course-card">
                                <div className="course-image">
                                    <img src={course.image} alt={course.title}/>
                                </div>
                                <div className="course-details">
                                    <h3 className="course-title">{course.title}</h3>
                                    <p className="course-description">{course.description}</p>
                                    <ul className="course-features">
                                        {course.features.map((feature, index) => (
                                            <li key={index}>🔷 {feature}</li>
                                        ))}
                                    </ul>
                                    <button className="button">Узнать</button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
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
                        pagination={{
                            clickable: true,
                            el: '.swiper-pagination'
                        }}
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
                    <div className="swiper-pagination"></div>
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
        name: '',
        email: '',
        phone: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    const validateForm = () => {
        let formErrors = {};
        let isValid = true;
        
        if (!formData.name.trim()) {
            formErrors.name = 'Введите имя';
            isValid = false;
        }
        
        if (!formData.email.trim()) {
            formErrors.email = 'Введите email';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = 'Некорректный email';
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
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);
            
            // Имитация отправки данных на сервер
            setTimeout(() => {
                console.log('Form submitted:', formData);
                alert('Заявка успешно отправлена!');
                setFormData({ name: '', email: '', phone: '' });
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
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Ваше имя"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={errors.name ? 'error' : ''}
                                />
                                {errors.name && <div className="error-message">{errors.name}</div>}
                            </div>
                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Ваш email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={errors.email ? 'error' : ''}
                                />
                                {errors.email && <div className="error-message">{errors.email}</div>}
                            </div>
                            <div className="input-group phone-input-group">
                                <div className="phone-input-container">
                                    <span className="phone-prefix">+7</span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="(999) 123-45-67"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={errors.phone ? 'error' : ''}
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