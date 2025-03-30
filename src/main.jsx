import React from "react";
import ReactDOM from "react-dom/client";
import {Header, MainContent, Courses, Reviews, FAQ, OrderForm, Footer, ScrollToTopButton, PromoBanner} from "./App";
import "./index.css";

const App = () => (
    <>
        <PromoBanner />
        <Header />
        <MainContent />
        <img src="/line2.svg" alt="Line" className="line2"/>
        <Courses />
        <Reviews />
        <img src="/line3.svg" alt="Line" className="line3"/>
        <FAQ/>
        <OrderForm/>
        <Footer/>
        <ScrollToTopButton />
    </>
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);