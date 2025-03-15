import React from "react";
import ReactDOM from "react-dom/client";
import {Header, MainContent, Courses, Advantages, FAQ, OrderForm, Footer} from "./App";
import "./index.css";

const App = () => (
    <>
        <Header />
        <MainContent />
        <Courses />
        <Advantages/>
        <FAQ/>
        <OrderForm/>
        <Footer/>
    </>
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);