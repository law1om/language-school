import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import './App.css'

import { useEffect } from "react";

const Header = () =>  (
    <header className="header">
        <div className="container">
            <div className="logo">
                <img src="" alt="logo" />
            </div>
            <nav className="menu">
                <ul className="menu_list">
                    <li className="menu_item">
                        <a href="#programs" data-link="programs">Программы</a>
                    </li>
                    <li className="menu_item">
                        <a href="#about-us" data-link="about-us">О нас</a>
                    </li>
                    <li className="menu_item">
                        <a href="#sign-up" data-link="sign-up">Записаться</a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
);

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
        <section className="courses">
            <div className="common-title">Выберите программу</div>
            <div className="container">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={3}
                    loop={true}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    navigation
                    pagination={{ clickable: true }}
                >
                    {courses.map((course) => (
                        <SwiperSlide key={course.id}>
                            <div className="course-card">
                                <div className="course-image">
                                    <img src={course.image} alt={course.title} />
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


export {Header, MainContent, Courses };
