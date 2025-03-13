import React from "react";
import ReactDOM from "react-dom/client";
import { Header, MainContent } from "./App";
import "./index.css";

const App = () => (
    <>
        <Header />
        <MainContent />
    </>
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);