import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseDetails, getCourseLearningMaterials, updateUserCourseProgress, isAuthenticated } from '../services/api';
import './CourseLearning.css';


const coursesData = [
  {
    id: 1,
    title: "Английский язык",
    modules: [
      {
        title: "Модуль 1: Основы английского",
        lessons: [
          {
            title: "Урок 1: Алфавит и произношение",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/MuZWpuB1Iqo"
          },
          {
            title: "Урок 2: Приветствия и знакомство",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/8P7i3LaCcgI"
          }
        ]
      },
      {
        title: "Модуль 2: Грамматика английского",
        lessons: [
          {
            title: "Урок 1: Времена и глаголы",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/lh1PDbpqzz4"
          },
          {
            title: "Урок 2: Построение предложений",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/RdhzrflYX6Y"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Немецкий язык",
    modules: [
      {
        title: "Модуль 1: Основы немецкого",
        lessons: [
          {
            title: "Урок 1: Немецкий алфавит и произношение",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/SH5X0s7a_Yg"
          },
          {
            title: "Урок 2: Приветствия и знакомство",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/r9os9Q6t6Xc"
          }
        ]
      },
      {
        title: "Модуль 2: Грамматика немецкого",
        lessons: [
          {
            title: "Урок 1: Артикли и падежи",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/YFP7q_Rw3p8"
          },
          {
            title: "Урок 2: Построение предложений",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/KzV_CG-Gp-Q"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Французский язык",
    modules: [
      {
        title: "Модуль 1: Основы французского",
        lessons: [
          {
            title: "Урок 1: Французское произношение",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/4K-sYdJimrc"
          },
          {
            title: "Урок 2: Приветствия и знакомство",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/hd0_GZHHWeE"
          }
        ]
      },
      {
        title: "Модуль 2: Грамматика французского",
        lessons: [
          {
            title: "Урок 1: Артикли и роды",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/mZ16sVJ-nAA"
          },
          {
            title: "Урок 2: Построение предложений",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/WxTE3-bnMfg"
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Испанский язык",
    modules: [
      {
        title: "Модуль 1: Основы испанского",
        lessons: [
          {
            title: "Урок 1: Испанский алфавит и произношение",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/X_FL6Ta_3WM"
          },
          {
            title: "Урок 2: Приветствия и знакомство",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/jzNC_ZdE7N0"
          }
        ]
      },
      {
        title: "Модуль 2: Грамматика испанского",
        lessons: [
          {
            title: "Урок 1: Глаголы и спряжения",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/CupnpvL7j5A"
          },
          {
            title: "Урок 2: Построение предложений",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/ER8PKb7JT3A"
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Итальянский язык",
    modules: [
      {
        title: "Модуль 1: Основы итальянского",
        lessons: [
          {
            title: "Урок 1: Итальянский алфавит и произношение",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/Jw-X9VyZfOE"
          },
          {
            title: "Урок 2: Приветствия и знакомство",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/Y3UB9EsJSsw"
          }
        ]
      },
      {
        title: "Модуль 2: Грамматика итальянского",
        lessons: [
          {
            title: "Урок 1: Артикли и существительные",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/AY2sYlLrGFk"
          },
          {
            title: "Урок 2: Построение предложений",
            content: "Здесь будет контент урока...",
            video: "https://www.youtube.com/embed/f0zrZz7arFw"
          }
        ]
      }
    ]
  }
];

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
          
          // Находим данные курса из coursesData по id
          const courseDataFromArray = coursesData.find(c => c.id === parseInt(id)) || coursesData[0];
          
          // Используем модули напрямую из массива данных
          setCourse({
            ...courseData,
            modules: courseDataFromArray.modules
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
                  
                  {course.modules[currentModule].lessons[currentLesson].video && (
                    <div className="lesson-video">
                      <h3>Видеоурок:</h3>
                      <div className="video-container">
                        <iframe 
                          width="100%" 
                          height="400" 
                          src={course.modules[currentModule].lessons[currentLesson].video} 
                          title={course.modules[currentModule].lessons[currentLesson].title}
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen>
                        </iframe>
                      </div>
                    </div>
                  )}
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