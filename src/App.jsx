import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import './App.css'
import { useState, useEffect, useRef} from "react";

const Header = () => {
    const scrollToSection = (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute('data-link');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="header">
            <div className="container">
                <div className="logo">
                    <img src="/logo.svg" alt="logo" />
                </div>
                <nav className="menu">
                    <ul className="menu_list">
                        <li className="menu_item">
                            <a href="#programs" data-link="programs" onClick={scrollToSection}>Программы</a>
                        </li>
                        <li className="menu_item">
                            <a href="#about-us" data-link="about-us" onClick={scrollToSection}>О нас</a>
                        </li>
                        <li className="menu_item">
                            <a href="#sign-up" data-link="sign-up" onClick={scrollToSection}>Записаться</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

const MainContent = () => {
    useEffect(() => {
        const button = document.getElementById("main-action-button");
        if (button) {
            button.addEventListener("click", () => alert("Заказ оформлен!"));
        }
    }, []);

    return (
        <section className="main_content">
            <div className="container">
                <img src="/line1.svg" alt="Line" className="line1" />
                <div className="main-info">
                    <h1 className="main-title">
                        Овладейте любым языком.</h1>
                    <p className="main-text">
                        Погрузитесь в мир языков с King's Course! Наши курсы помогут вам овладеть английским и другими языками легко, эффективно и с удовольствием.
                    </p>
                </div>
                <div className="main-action">
                    <button className="button" id="main-action-button">Попробовать!</button>
                </div>
                <img src="/foreign-language.svg" alt="foreign-language" className="main-image" />
            </div>
        </section>
    );
};

const courses = [
    {
        id: 1,
        image: "/eng.png",
        title: "Английский язык 🇬🇧",
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
        title: "Немецкий язык 🇩🇪",
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
        title: "Французский язык 🇫🇷",
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
        title: "Испанский язык 🇪🇸",
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
        title: "Итальянский язык 🇮🇹",
        description: "Говори, как в Италии!",
        features: [
            "Итальянский для путешествий",
            "Музыка и кино на итальянском",
            "Культура и традиции Италии"
        ]
    }
];


const Courses = () => {
    return (
        <section className="courses" id="programs">
            <img src="/line2.svg" alt="Line" className="line2"/>
            <div className="common-title">Выберите программу</div>
            <div className="container">

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={3}
                    loop={true}
                    autoplay={{delay: 2500, disableOnInteraction: false}}
                    navigation
                    pagination={{clickable: true}}
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
};


const advantages = [
    {id: 1, title: "Опытные преподаватели", icon: "👨‍🏫" },
    { id: 2, title: "Живое общение", icon: "💬" },
    { id: 3, title: "Методики мирового уровня", icon: "🧠" },
    { id: 4, title: "Подготовка к экзаменам", icon: "📝" },

];

const Advantages = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                    }
                });
            },
            { threshold: 0.3 }
        );

        const cards = sectionRef.current.querySelectorAll(".card");
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (

        <section className="advantages" id="about-us" ref={sectionRef}>
            <h2 className="common-title">Наши преимущества</h2>
            <p className="description">
                Наши курсы — это идеальное сочетание актуальных знаний, практического опыта и удобного формата обучения. Мы предлагаем качественные материалы, поддержку экспертов и обратную связь.
            </p>
            <div className="cards">
                {advantages.map((adv) => (
                    <div key={adv.id} className="card hidden">
                        <span className="icon">{adv.icon}</span>
                        <p>{adv.title}</p>
                    </div>
                ))}
            </div>

        </section>

    );
};



const faqs = [
    { question: "Какие языки можно изучать?", answer: "У нас есть курсы по английскому, немецкому, французскому, испанскому и итальянскому языкам." },
    { question: "Как записаться на курс?", answer: "Вы можете оставить заявку на сайте, и наш менеджер свяжется с вами для уточнения деталей." },
    { question: "Есть ли пробный урок?", answer: "Да, у нас есть пробные уроки, на которых вы можете познакомиться с преподавателем и методикой обучения." },
    { question: "Как проходит обучение?", answer: "Обучение проходит онлайн или офлайн, в зависимости от вашего выбора. Включает в себя лекции, практику и разговорные клубы." },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq">
            <h2 className="common-title">Часто задаваемые вопросы</h2>
            <div className="container">
                {faqs.map((faq, index) => (
                    <div key={index} className={`faq-item ${openIndex === index ? "open" : ""}`}>
                        <button className="faq-question" onClick={() => toggleFAQ(index)}>
                            {faq.question}
                            <span className="arrow">{openIndex === index ? "▲" : "▼"}</span>
                        </button>
                        <div className="faq-answer" style={{ maxHeight: openIndex === index ? "100px" : "0" }}>
                            <p>{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};



const OrderForm = () => {
    return (
        <section className="order" id="sign-up">
            <img src="/line3.svg" alt="Line" className="line3" />
            <div className="container">
                <div className="common-title">Запишитесь на курс</div>
                <div className="order-block">
                    <div className="order-form">
                        <div className="order-form-text">
                            Начните изучение языка уже сегодня! Заполните форму, и наш менеджер свяжется с вами для консультации.
                        </div>
                        <div className="order-form-inputs">
                            <input type="text" placeholder="Выберите язык" id="course" />
                            <input type="text" placeholder="Ваше имя" id="name" />
                            <input type="text" placeholder="Ваш телефон" id="phone" />
                            <button className="button violet-button" id="order-action">Оставить заявку</button>
                        </div>
                    </div>
                    <div className="order-block-image">
                        <img src="/books.svg" alt="Languages" className="order-image" />
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-text">
                        KINGS COURSE
                    </div>
                    <button className="scroll-top" onClick={scrollToTop} aria-label="Прокрутить наверх">
                        ↑
                    </button>
                </div>
                <p className="rights">© 2025 «Все права защищены»</p>
            </div>
        </footer>
    );
};


export {Header, MainContent, Courses, Advantages, FAQ, OrderForm, Footer};
