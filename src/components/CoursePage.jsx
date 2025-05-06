import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseDetails, enrollInCourse, isAuthenticated, getEnrollments, isAdmin } from '../services/api';
import CourseReviews from './CourseReviews';
import './CoursePage.css';

function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [expandedSections, setExpandedSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  // Демонстрационные данные для UI
  const coursesData = [
    {
      id: 1,
      image: "/courses-bg/eng-bg.jpg",
      title: "Английский язык",
      description: "Погрузись в мир английского!",
      features: [
        "Курсы для всех уровней (A1–C2)",
        "Разговорная практика с носителями",
        "Подготовка к экзаменам (IELTS, TOEFL)"
      ],
      program: [
        {
          title: "Начальный уровень",
          content: [
            "Базовая грамматика и лексика",
            "Повседневные фразы и выражения",
            "Основы произношения"
          ],
          video: "https://www.youtube.com/embed/MuZWpuB1Iqo"
        },
        {
          title: "Продвинутый уровень",
          content: [
            "Сложные грамматические конструкции",
            "Деловой английский и переговоры",
            "Подготовка к международным экзаменам"
          ],
          video: "https://www.youtube.com/embed/LZNcVz7cV2A"
        }
      ]
    },
    {
      id: 2,
      image: "/courses-bg/ger-bg.jpg",
      title: "Немецкий язык",
      description: "Открой для себя язык Гёте!",
      features: [
        "Грамматика и произношение с нуля",
        "Подготовка к Goethe-Zertifikat",
        "Бизнес-немецкий и путешествия"
      ],
      program: [
        {
          title: "Базовый курс",
          content: [
            "Немецкий алфавит и произношение",
            "Основные фразы и выражения",
            "Простые грамматические конструкции"
          ],
          video: "https://www.youtube.com/embed/r9os9Q6t6Xc"
        },
        {
          title: "Продвинутый курс",
          content: [
            "Сложная грамматика (времена, склонения)",
            "Разговорная практика и диалоги",
            "Чтение и анализ немецких текстов"
          ],
          video: "https://www.youtube.com/embed/YFP7q_Rw3p8"
        }
      ]
    },
    {
      id: 3,
      image: "/courses-bg/france-bg.jpg",
      title: "Французский язык",
      description: "Говори, как парижанин!",
      features: [
        "Французский с нуля до продвинутого уровня",
        "Подготовка к DELF/DALF",
        "Разговорные клубы и интерактивные уроки"
      ],
      program: [
        {
          title: "Вводный курс",
          content: [
            "Фонетика и произношение",
            "Базовый словарный запас",
            "Простые грамматические структуры"
          ],
          video: "https://www.youtube.com/embed/4K-sYdJimrc"
        },
        {
          title: "Профессиональный курс",
          content: [
            "Бизнес-французский",
            "Подготовка к экзаменам DELF/DALF",
            "Перевод и интерпретация"
          ],
          video: "https://www.youtube.com/embed/mZ16sVJ-nAA"
        }
      ]
    },
    {
      id: 4,
      image: "/courses-bg/spain-bg.jpg",
      title: "Испанский язык",
      description: "Почувствуй страсть Испании!",
      features: [
        "Латинская Америка vs Испания",
        "Подготовка к DELE",
        "Сленг и культура испаноязычных стран"
      ],
      program: [
        {
          title: "Уровень A1-A2",
          content: [
            "Основы испанской грамматики",
            "Базовые разговорные фразы",
            "Испанское произношение"
          ],
          video: "https://www.youtube.com/embed/X_FL6Ta_3WM"
        },
        {
          title: "Уровень B1-C2",
          content: [
            "Углубленная грамматика",
            "Разговорная практика",
            "Деловой испанский и подготовка к DELE"
          ],
          video: "https://www.youtube.com/embed/CupnpvL7j5A"
        }
      ]
    },
    {
      id: 5,
      image: "/courses-bg/italy-bg.jpg",
      title: "Итальянский язык",
      description: "Говори, как в Италии!",
      features: [
        "Итальянский для путешествий",
        "Музыка и кино на итальянском",
        "Культура и традиции Италии"
      ],
      program: [
        {
          title: "Начальный уровень",
          content: [
            "Базовая грамматика и лексика",
            "Итальянское произношение",
            "Простые диалоги"
          ],
          video: "https://www.youtube.com/embed/Jw-X9VyZfOE"
        },
        {
          title: "Продвинутый уровень",
          content: [
            "Сложные грамматические конструкции",
            "Итальянская литература и кино",
            "Деловой итальянский"
          ],
          video: "https://www.youtube.com/embed/AY2sYlLrGFk"
        }
      ]
    },
    {
      id: 6,
      image: "/courses-bg/japon-bg.avif",
      title: "Японский язык",
      description: "Погрузись в культуру Японии!",
      features: [
        "Японский язык с носителями",
        "Подготовка к JLPT (N5–N1)",
        "Разговорная практика и чтение манги"
      ],
      program: [
        {
          title: "Хирагана и Катакана",
          content: [
            "Изучение японских азбук",
            "Базовые фразы и выражения",
            "Основы грамматики"
          ]
        },
        {
          title: "Кандзи и грамматика",
          content: [
            "Изучение базовых иероглифов",
            "Расширенная грамматика",
            "Разговорная практика"
          ]
        },
        {
          title: "Продвинутый японский",
          content: [
            "Сложные иероглифы и выражения",
            "Подготовка к JLPT",
            "Изучение японской культуры"
          ]
        }
      ]
    },
    {
      id: 7,
      image: "/courses-bg/china-bg.avif",
      title: "Китайский язык",
      description: "Откройте для себя язык будущего!",
      features: [
        "Изучение иероглифов с нуля",
        "Подготовка к HSK (1-6)",
        "Бизнес-китайский и культура Китая"
      ],
      program: [
        {
          title: "Базовый китайский",
          content: [
            "Китайская фонетика и тоны",
            "Базовые иероглифы",
            "Простые разговорные фразы"
          ]
        },
        {
          title: "Средний уровень",
          content: [
            "Расширенный словарный запас",
            "Грамматические конструкции",
            "Разговорная практика"
          ]
        },
        {
          title: "Продвинутый курс",
          content: [
            "Сложные иероглифы и выражения",
            "Деловой китайский",
            "Подготовка к HSK 5-6"
          ]
        }
      ]
    },
    {
      id: 8,
      image: "/courses-bg/korea-bg.avif",
      title: "Корейский язык",
      description: "Погрузитесь в K-culture!",
      features: [
        "Корейский алфавит и грамматика",
        "Подготовка к TOPIK",
        "K-pop и корейские сериалы"
      ],
      program: [
        {
          title: "Хангыль (корейский алфавит)",
          content: [
            "Изучение корейского алфавита",
            "Базовое произношение",
            "Простые фразы"
          ]
        },
        {
          title: "Базовая грамматика",
          content: [
            "Основные грамматические конструкции",
            "Расширение словарного запаса",
            "Повседневные диалоги"
          ]
        },
        {
          title: "Продвинутый корейский",
          content: [
            "Сложная грамматика",
            "Подготовка к TOPIK",
            "Изучение корейской культуры"
          ]
        }
      ]
    },
    {
      id: 9,
      image: "/courses-bg/arab-bg.avif",
      title: "Арабский язык",
      description: "Изучите язык Ближнего Востока!",
      features: [
        "Арабский алфавит и каллиграфия",
        "Диалекты арабского мира",
        "Культура и традиции арабских стран"
      ],
      program: [
        {
          title: "Арабский алфавит",
          content: [
            "Изучение арабских букв",
            "Основы каллиграфии",
            "Базовое произношение"
          ]
        },
        {
          title: "Базовая грамматика",
          content: [
            "Грамматические структуры",
            "Базовые разговорные фразы",
            "Различия между диалектами"
          ]
        },
        {
          title: "Продвинутый уровень",
          content: [
            "Сложная грамматика",
            "Современный стандартный арабский",
            "Арабская литература и СМИ"
          ]
        }
      ]
    },
    {
      id: 10,
      image: "/courses-bg/portugal-bg.avif",
      title: "Португальский язык",
      description: "Откройте мир лузофонии!",
      features: [
        "Португальский Португалии и Бразилии",
        "Подготовка к CAPLE",
        "Культура португалоязычных стран"
      ],
      program: [
        {
          title: "Начальный уровень",
          content: [
            "Базовая лексика и грамматика",
            "Португальское произношение",
            "Простые диалоги"
          ]
        },
        {
          title: "Средний уровень",
          content: [
            "Углубленная грамматика",
            "Различия между португальским Португалии и Бразилии",
            "Разговорная практика"
          ]
        },
        {
          title: "Продвинутый уровень",
          content: [
            "Сложные грамматические конструкции",
            "Деловой португальский",
            "Подготовка к CAPLE"
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        
        const courseData = await getCourseDetails(id);
        
        
        const demoData = coursesData.find(c => c.id === parseInt(id)) || coursesData[0];
        
        
        setCourse({
          ...courseData,
          image: demoData.image,
          features: demoData.features,
          program: demoData.program
        });

        // Проверяем, является ли пользователь администратором
        setIsAdminUser(isAdmin());
        
        if (isAuthenticated()) {
          try {
            const enrollments = await getEnrollments();
            const enrolled = enrollments.some(e => e.courseId === parseInt(id));
            setIsEnrolled(enrolled);
          } catch (err) {
            console.error('Ошибка при получении записей на курсы:', err);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке курса:', error);
        setError('Не удалось загрузить данные курса. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const toggleSection = (index) => {
    setExpandedSections(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const scrollToOrder = () => {
    
    const orderSection = document.getElementById('order');
    if (orderSection) {
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const yOffset = -headerHeight - 20 + 270;
      const y = orderSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
      
      
      if (course && window.setCourseInOrderForm) {
        window.setCourseInOrderForm(course.title);
      }
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleEnroll = async () => {
    if (!isAuthenticated()) {
      alert('Для записи на курс необходимо авторизоваться');
      return;
    }

    try {
      setEnrolling(true);
      await enrollInCourse(id);
      alert('Вы успешно записались на курс!');
    } catch (error) {
      console.error('Ошибка при записи на курс:', error);
      alert(error.message || 'Не удалось записаться на курс. Пожалуйста, попробуйте позже.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = async () => {
    if (!isAuthenticated()) {
      alert('Для начала обучения необходимо авторизоваться');
      return;
    }

    try {
      setEnrolling(true);
      if (!isEnrolled) {
        await enrollInCourse(id);
      }
      navigate(`/course/${id}/learn`);
    } catch (error) {
      console.error('Ошибка при начале обучения:', error);
      alert(error.message || 'Не удалось начать обучение. Пожалуйста, попробуйте позже.');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="course-page-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка информации о курсе...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-page-error">
        <h2>Ошибка</h2>
        <p>{error || 'Курс не найден'}</p>
        <a href="/" className="btn-back">Вернуться на главную</a>
      </div>
    );
  }

  return (
    <div className="course-page">
      <div className="course-page-header" style={{ backgroundImage: `url(${course.image})` }}>
        <button className="back-button" onClick={goBack}>← Назад</button>
        <div className="header-content">
          <h1>{course.title}</h1>
          <p className="header-description">{course.description}</p>
        </div>
      </div>
      <div className="course-page-container">
        {/* Удаляем блок с кнопками администратора
        {isAdminUser && (
          <div className="admin-course-controls">
            <button className="edit-course-btn" onClick={handleEditCourse}>
              Редактировать курс
            </button>
            {showDeleteConfirm ? (
              <div className="delete-confirm">
                <p>Вы уверены, что хотите удалить этот курс?</p>
                <div className="delete-buttons">
                  <button 
                    className="confirm-delete-btn" 
                    onClick={handleDeleteCourse}
                    disabled={deleting}
                  >
                    {deleting ? 'Удаление...' : 'Да, удалить'}
                  </button>
                  <button className="cancel-delete-btn" onClick={cancelDelete}>
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <button className="delete-course-btn" onClick={handleDeleteCourse}>
                Удалить курс
              </button>
            )}
          </div>
        )}
        */}
        
        <div className="course-page-content">
          <div className="course-description-section">
            <h2>Описание курса</h2>
            <div className="course-features">
              <h3>Особенности:</h3>
              <ul>
                {course.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="course-program-section">
            <h2>Программа курса</h2>
            <div className="program-accordion">
              {course.program.map((section, index) => (
                <div key={index} className="program-section">
                  <div 
                    className={`program-header ${expandedSections.includes(index) ? 'expanded' : ''}`}
                    onClick={() => toggleSection(index)}
                  >
                    <h3>{section.title}</h3>
                    <span className="accordion-icon">
                      {expandedSections.includes(index) ? '−' : '+'}
                    </span>
                  </div>
                  <div className={`program-content ${expandedSections.includes(index) ? 'expanded' : ''}`}>
                    <ul>
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                    {section.video && expandedSections.includes(index) && (
                      <div className="program-video">
                        <h4>Демонстрационное видео:</h4>
                        <div className="video-container">
                          <iframe 
                            width="100%" 
                            height="315" 
                            src={section.video} 
                            title={`Видео для ${section.title}`}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen>
                          </iframe>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="course-enrollment">
            <h2>Хотите начать обучение?</h2>
            <button 
              className={`enroll-button ${isEnrolled ? 'continue' : ''}`} 
              onClick={handleStartLearning}
            >
              {isEnrolled ? 'Продолжить обучение' : 'Начать обучение'}
            </button>
          </div>
          
          <div className="other-courses">
            <h2>Другие курсы</h2>
            <div className="courses-icons">
              {coursesData.filter(c => c.id !== course.id).map(otherCourse => (
                <div 
                  key={otherCourse.id} 
                  className="course-icon" 
                  onClick={() => navigate(`/course/${otherCourse.id}`)}
                  style={{ backgroundImage: `url(${otherCourse.image})` }}
                >
                  <span>{otherCourse.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="course-reviews">
        <div className="container">
          <CourseReviews courseId={id} />
        </div>
      </div>
    </div>
  );
}

export default CoursePage; 