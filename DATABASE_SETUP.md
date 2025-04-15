# Настройка базы данных PostgreSQL для проекта Language School

В этом руководстве описаны шаги по установке и настройке PostgreSQL для проекта языковой школы.

## 1. Установка PostgreSQL 16

### Windows

1. Скачайте установщик PostgreSQL 16 с [официального сайта](https://www.postgresql.org/download/windows/).
2. Запустите установщик и следуйте инструкциям:
   - Выберите компоненты для установки (рекомендуется оставить все по умолчанию)
   - Укажите директорию для установки
   - Установите пароль для пользователя `postgres`: **19189**
   - Оставьте порт по умолчанию: **5432**
   - Выберите локализацию по умолчанию
3. Завершите установку и убедитесь, что сервис PostgreSQL запущен.

### macOS

1. Установите PostgreSQL с помощью Homebrew:
   ```bash
   brew install postgresql@16
   ```
2. Запустите сервис:
   ```bash
   brew services start postgresql@16
   ```
3. Создайте пользователя postgres с паролем:
   ```bash
   createuser -s postgres
   psql -U postgres
   ALTER USER postgres WITH PASSWORD '19189';
   ```

### Linux (Ubuntu/Debian)

1. Добавьте репозиторий PostgreSQL:
   ```bash
   sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
   wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
   sudo apt-get update
   ```
2. Установите PostgreSQL 16:
   ```bash
   sudo apt-get install postgresql-16
   ```
3. Запустите сервис:
   ```bash
   sudo systemctl start postgresql
   ```
4. Настройте пароль для пользователя postgres:
   ```bash
   sudo -u postgres psql
   ALTER USER postgres WITH PASSWORD '19189';
   ```

## 2. Создание базы данных

1. Подключитесь к PostgreSQL с помощью командной строки или клиента:
   ```bash
   psql -U postgres
   ```
   Введите пароль: `19189`

2. Создайте базу данных:
   ```sql
   CREATE DATABASE "language-school";
   ```

3. Проверьте, что база данных создана:
   ```sql
   \l
   ```

## 3. Настройка подключения в приложении

База данных настроена для подключения со следующими параметрами:

- Хост: `localhost`
- Порт: `5432`
- База данных: `language-school`
- Пользователь: `postgres`
- Пароль: `19189`

Эти параметры указаны в файле `.env` в директории `server`:

```
DATABASE_URL="postgresql://postgres:19189@localhost:5432/language-school"
```

## 4. Применение миграций

Чтобы применить миграции к базе данных, выполните следующие команды:

```bash
cd server
npm run prisma:migrate
```

Это создаст все необходимые таблицы и связи в базе данных согласно схеме Prisma.

## 5. Проверка работоспособности

Чтобы проверить подключение к базе данных, запустите сервер:

```bash
cd server
npm run dev
```

Если вы видите сообщение `Успешное подключение к базе данных PostgreSQL` в консоли, значит соединение установлено правильно.

## 6. Проблемы и их решения

### Ошибка подключения к базе данных

Если вы получаете ошибку при подключении к базе данных:

1. Убедитесь, что сервис PostgreSQL запущен
2. Проверьте правильность параметров подключения в файле `.env`
3. Проверьте, что база данных создана и доступна:
   ```bash
   psql -U postgres -d language-school
   ```

### Ошибка при применении миграций

Если возникают ошибки при выполнении миграций:

1. Убедитесь, что в базе данных нет таблиц с конфликтующими именами
2. Проверьте права доступа пользователя postgres
3. Попробуйте выполнить сброс миграций:
   ```bash
   npm run prisma:reset
   ```

## 7. Дополнительные материалы

- [Официальная документация PostgreSQL](https://www.postgresql.org/docs/16/index.html)
- [Документация Prisma](https://www.prisma.io/docs)
- [Настройка PostgreSQL для разработки](https://www.postgresql.org/docs/16/tutorial.html) 