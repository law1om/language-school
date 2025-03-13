
import './App.css'

import { useEffect } from "react";

const Header = () => (
    <header className="header">
        <div className="container">
            <div className="logo">
                <img src="#" alt="logo" />
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

export { Header, MainContent };
