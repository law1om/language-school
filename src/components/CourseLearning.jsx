import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseDetails, getCourseLearningMaterials, updateUserCourseProgress, isAuthenticated } from '../services/api';
import './CourseLearning.css';

function CourseLearning() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);

  useEffect(() => {
    // Добавляем класс к body для стилизации хедера
    document.body.classList.add('learning-page-active');
    
    // Проверка авторизации
    if (!isAuthenticated()) {
      alert('Для доступа к учебным материалам необходимо авторизоваться');
      navigate('/login');
      return;
    }

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        // Получаем основные данные курса
        const courseData = await getCourseDetails(id);
        
        // Пытаемся получить учебные материалы с сервера
        try {
          const materials = await getCourseLearningMaterials(id);
          setCourse({
            ...courseData,
            modules: materials.modules
          });
        } catch (err) {
          console.error('Ошибка при загрузке учебных материалов:', err);
          // Если не удалось получить материалы с сервера, используем демо-данные
          setCourse({
            ...courseData,
            modules: [
              {
                title: "Модуль 1: Основы",
                lessons: [
                  { title: "Урок 1: Алфавит и произношение", content: "Здесь будет контент урока..." },
                  { title: "Урок 2: Приветствия и знакомство", content: "Здесь будет контент урока..." },
                  { title: "Урок 3: Базовые фразы", content: "Здесь будет контент урока..." },
                ]
              },
              {
                title: "Модуль 2: Базовая грамматика",
                lessons: [
                  { title: "Урок 1: Существительные", content: "Здесь будет контент урока..." },
                  { title: "Урок 2: Местоимения", content: "Здесь будет контент урока..." },
                  { title: "Урок 3: Простые предложения", content: "Здесь будет контент урока..." },
                ]
              },
              {
                title: "Модуль 3: Разговорная практика",
                lessons: [
                  { title: "Урок 1: В магазине", content: "Здесь будет контент урока..." },
                  { title: "Урок 2: В ресторане", content: "Здесь будет контент урока..." },
                  { title: "Урок 3: Спрашиваем дорогу", content: "Здесь будет контент урока..." },
                ]
              }
            ]
          });
        }
      } catch (error) {
        console.error('Ошибка при загрузке курса:', error);
        setError('Не удалось загрузить учебные материалы. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();

    // Функция очистки при размонтировании компонента
    return () => {
      document.body.classList.remove('learning-page-active');
    };
  }, [id, navigate]);

  const handleModuleClick = (moduleIndex) => {
    setCurrentModule(moduleIndex);
    setCurrentLesson(0);
  };

  const handleLessonClick = (lessonIndex) => {
    setCurrentLesson(lessonIndex);
  };

  const updateProgress = async () => {
    try {
      // Отправляем информацию о прогрессе пользователя
      await updateUserCourseProgress(id, {
        moduleId: currentModule,
        lessonId: currentLesson,
        completed: true
      });
    } catch (error) {
      console.error('Ошибка при обновлении прогресса:', error);
    }
  };

  const goToNextLesson = () => {
    updateProgress();
    
    if (currentLesson < course.modules[currentModule].lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    } else if (currentModule < course.modules.length - 1) {
      setCurrentModule(currentModule + 1);
      setCurrentLesson(0);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    } else if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
      setCurrentLesson(course.modules[currentModule - 1].lessons.length - 1);
    }
  };

  const goBack = () => {
    navigate(`/course/${id}`);
  };

  if (loading) {
    return (
      <div className="course-learning-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка учебных материалов...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-learning-error">
        <h2>Ошибка</h2>
        <p>{error || 'Курс не найден'}</p>
        <button onClick={goBack} className="btn-back">Вернуться к описанию курса</button>
      </div>
    );
  }

  return (
    <div className="course-learning-page">
      <div className="course-learning-header">
        <button className="back-button" onClick={goBack}>← Назад</button>
        <h1>{course.title} - Обучение</h1>
      </div>

      <div className="course-learning-wrapper">
        <div className="course-learning-container">
          <aside className="course-learning-sidebar">
            <h2>Программа курса</h2>
            <div className="modules-list">
              {course.modules && course.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="module-item">
                  <div 
                    className={`module-title ${currentModule === moduleIndex ? 'active' : ''}`}
                    onClick={() => handleModuleClick(moduleIndex)}
                  >
                    {module.title}
                  </div>
                  {currentModule === moduleIndex && (
                    <ul className="lessons-list">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <li 
                          key={lessonIndex} 
                          className={currentLesson === lessonIndex ? 'active' : ''}
                          onClick={() => handleLessonClick(lessonIndex)}
                        >
                          {lesson.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </aside>

          <main className="course-learning-content">
            {course.modules && course.modules[currentModule] && course.modules[currentModule].lessons[currentLesson] && (
              <div className="lesson-content">
                <h2>{course.modules[currentModule].lessons[currentLesson].title}</h2>
                <div className="lesson-material">
                  {course.modules[currentModule].lessons[currentLesson].content}
                </div>
                <div className="lesson-navigation">
                  <button 
                    disabled={currentLesson === 0 && currentModule === 0} 
                    onClick={goToPreviousLesson}
                  >
                    Предыдущий урок
                  </button>
                  <button 
                    disabled={
                      currentModule === course.modules.length - 1 && 
                      currentLesson === course.modules[currentModule].lessons.length - 1
                    } 
                    onClick={goToNextLesson}
                  >
                    Следующий урок
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default CourseLearning; 