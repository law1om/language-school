import React, { useState, useEffect } from 'react';
import './Assistant.css';

const Assistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSubmissions, setShowSubmissions] = useState(false);
    const [formSubmissions, setFormSubmissions] = useState([]);

    const togglePopup = () => {
        setIsOpen(!isOpen);
       
        if (!isOpen) {
            loadFormSubmissions();
        }
    };

    const loadFormSubmissions = () => {
        try {
            const data = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
            setFormSubmissions(data);
        } catch (error) {
            console.error('Ошибка при загрузке данных из localStorage:', error);
            setFormSubmissions([]);
        }
    };

    const toggleSubmissions = () => {
        setShowSubmissions(!showSubmissions);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="assistant">
            <button onClick={togglePopup} className="assistant-button" title="Нажмите, чтобы открыть">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.064-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
            </button>
            <div className={`popup ${isOpen ? 'popup-visible' : ''}`}>
                <div className="popup-header">
                    <h2>Нужна помощь?</h2>
                    <button className="close-button" onClick={togglePopup}>×</button>
                </div>
                <div className="popup-content">
                    <p>Наши консультанты готовы ответить на все ваши вопросы о курсах иностранных языков.</p>
                    <a href="https://t.me/muimuimchsya" target="_blank" rel="noopener noreferrer" className="telegram-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.064-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        Написать в Telegram
                    </a>
                    
                    <div className="submissions-section">
                        <button onClick={toggleSubmissions} className="submissions-toggle">
                            {showSubmissions ? 'Скрыть заявки' : 'Показать ваши заявки'} 
                            <span className="toggle-icon">{showSubmissions ? '▲' : '▼'}</span>
                        </button>
                        
                        {showSubmissions && (
                            <div className="submissions-list">
                                {formSubmissions.length > 0 ? (
                                    <>
                                    
                                        {formSubmissions.map((submission) => (
                                            <div key={submission.id} className="submission-item">
                                                <div><strong>Курс:</strong> {submission.course}</div>
                                                <div><strong>Имя:</strong> {submission.name}</div>
                                                <div><strong>Телефон:</strong> {submission.phone}</div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <p className="no-submissions">Нет сохраненных заявок</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assistant; 