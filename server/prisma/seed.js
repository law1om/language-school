const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Начинаем заполнение базы данных демонстрационными данными...');
  
  // Проверяем, есть ли уже курсы в базе
  const coursesCount = await prisma.course.count();
  
  if (coursesCount > 0) {
    console.log(`В базе данных уже есть ${coursesCount} курсов. Очищаем базу перед заполнением...`);
    
    // Очищаем таблицы в правильном порядке (из-за внешних ключей)
    await prisma.review.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.course.deleteMany({});
    
    console.log('База данных очищена.');
  }
  
  // Демонстрационные курсы
  const demoCourses = [
    {
      title: "Английский язык",
      description: "Погрузись в мир английского! Курсы для всех уровней от начинающих до продвинутых. Разговорная практика с носителями и подготовка к международным экзаменам.",
      imageUrl: "/courses-bg/eng-bg.avif"
    },
    {
      title: "Немецкий язык",
      description: "Открой для себя язык Гёте! Грамматика и произношение с нуля, бизнес-немецкий и подготовка к Goethe-Zertifikat.",
      imageUrl: "/courses-bg/ger-bg.avif"
    },
    {
      title: "Французский язык",
      description: "Говори, как парижанин! Французский с нуля до продвинутого уровня. Подготовка к DELF/DALF и разговорные клубы.",
      imageUrl: "/courses-bg/fr-bg.avif"
    },
    {
      title: "Испанский язык",
      description: "Почувствуй страсть Испании! Особенности испанского в Латинской Америке и Испании, подготовка к DELE и изучение культуры испаноязычных стран.",
      imageUrl: "/courses-bg/esp-bg.avif"
    },
    {
      title: "Итальянский язык",
      description: "Говори, как в Италии! Итальянский для путешествий, изучение музыки и кино на итальянском, погружение в культуру.",
      imageUrl: "/courses-bg/italy-bg.avif"
    },
    {
      title: "Японский язык",
      description: "Погрузись в культуру Японии! Занятия с носителями языка, подготовка к JLPT (N5–N1) и практика через чтение манги.",
      imageUrl: "/courses-bg/japon-bg.avif"
    },
    {
      title: "Китайский язык",
      description: "Откройте для себя язык будущего! Изучение иероглифов с нуля, подготовка к HSK (1-6) и бизнес-китайский.",
      imageUrl: "/courses-bg/china-bg.avif"
    },
    {
      title: "Корейский язык",
      description: "Погрузитесь в K-culture! Изучение корейского алфавита и грамматики, подготовка к TOPIK и погружение в мир K-pop.",
      imageUrl: "/courses-bg/korea-bg.avif"
    },
    {
      title: "Арабский язык",
      description: "Изучите язык Ближнего Востока! Арабский алфавит и каллиграфия, изучение диалектов и культуры арабских стран.",
      imageUrl: "/courses-bg/arab-bg.avif"
    },
    {
      title: "Португальский язык",
      description: "Откройте мир лузофонии! Изучение особенностей португальского в Португалии и Бразилии, подготовка к CAPLE.",
      imageUrl: "/courses-bg/portugal-bg.avif"
    }
  ];
  
  // Добавляем курсы в базу данных
  const createdCourses = await prisma.course.createMany({
    data: demoCourses
  });
  
  console.log(`Успешно добавлено ${createdCourses.count} демонстрационных курсов в базу данных`);
}

main()
  .catch((e) => {
    console.error('Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 