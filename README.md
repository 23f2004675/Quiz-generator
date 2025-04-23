# Quizgen

Quizgen is a dynamic web application designed to create, manage, and master quizzes effortlessly. It is a multi-user app (one requires an administrator and other users) that acts as an exam preparation site for multiple courses.

[![Demo Video](https://img.shields.io/badge/Video_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://drive.google.com/file/d/16PTD8y75gmB-HCmemrKdMZSep47nk59_/view?usp=sharing)

![Screenshot 2025-04-24 at 1 48 37 AM](https://github.com/user-attachments/assets/78e2a35c-574f-462a-acf6-3747d712e944)

## Table of Contents

- [File Structure](#file-structure)
- [Roles](#roles)
  - [1. Admin (Quiz Master)](#1-admin-quiz-master)
  - [2. User](#2-user)
- [Database Structure](#database-structure)
  - [User Table](#user-table)
  - [Role Table](#role-table)
  - [UserRoles Table](#userroles-table)
  - [Subject Table](#subject-table)
  - [Chapter Table](#chapter-table)
  - [Quiz Table](#quiz-table)
  - [Question Table](#question-table)
  - [Score Table](#score-table)
- [ER Diagram](#er-diagram)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Launch Services](#launch-services)
- [Screenshots](#screenshots)


## File Structure

```bash
Quiz-Master
├── backend/                     # Backend Python modules
│   ├── api/                     # API endpoints
│   │   ├── __pycache__/         # Python compiled bytecode
│   │   ├── chapters.py          # Chapter-related endpoints
│   │   ├── quiz.py              # Quiz management endpoints
│   │   ├── score.py             # Score handling endpoints
│   │   ├── subjects.py          # Subject management endpoints
│   │   ├── summary.py           # Summary/analytics endpoints
│   │   └── users.py             # User management endpoints
│   ├── app/                     # Application logic
│   │   ├── __pycache__/         # Python compiled bytecode
│   │   ├── config.py            # Application configuration
│   │   ├── models.py            # Database models
│   │   └── routes.py            # Main application routes
│   ├── tasks/                   # Celery background tasks
│   │   ├── __pycache__/         # Python compiled bytecode
│   │   ├── user-downloads/      # Generated user files
│   │   │   ├── admin_1b611c14-6d43-4f94-958e-41
│   │   │   └── score_fe9937b5-d534-4db8-aebb-9c
│   │   ├── celery_schedule.py   # Celery beat schedule
│   │   ├── celery.py            # Celery configuration
│   │   ├── mail_service.py      # Email service
│   │   └── tasks.py             # Task definitions
│   └── CreateData.py            # Database initialization script
├──frontend/
│   ├── assets/                  # Static assets (images, fonts)
│   ├── components/              # Reusable components
│   │   ├── Footer.js            # Footer component
│   │   ├── Navbar.js            # Navigation bar
│   │   ├── Question.js          # Question component
│   │   └── Quiz.js              # Quiz container
│   ├── pages/                   # Page components
│   │   ├── Admin/               # Admin views
│   │   │   ├── Admin_dashboard.js
│   │   │   ├── Admin_quiz.js
│   │   │   ├── Admin_search.js
│   │   │   ├── Admin_summary.js
│   │   │   └── Admin_user.js
│   │   ├── User/                # User views
│   │   │   ├── Scores.js
│   │   │   ├── StartQuiz.js
│   │   │   ├── User_dashboard.js
│   │   │   ├── User_search.js
│   │   │   └── User_summary.js
│   │   ├── LoginPage.js         # Auth pages
│   │   └── RegisterPage.js
│   ├── utils/                   # Utilities
│   │   ├── router.js            # Routing logic
│   │   └── store.js             # State management
│   ├── app.js                   # Main application entry
│   ├── daily.html               # Daily report template
│   ├── index.html               # Main HTML entry point
│   └── monthly_report.html      # Monthly report template
│
├── instance/                    # Instance-specific files
│   └── database.sqlite3         # SQLite database
│
├── .gitignore                   # Git ignore rules
├── celerybeat-schedule.db       # Celery beat schedule DB
├── dump.rdb                     # Redis dump file
├── ER_diagram.png               # Database schema diagram
├── local_setup.sh               # Local environment setup
├── main.py                      # Flask application entry
├── QUIZGEN_PROJECT_REPORT.pdf   # Project documentation
├── README.md                    # Project readme
├── requirements.txt             # Python dependencies
├── start_application.sh         # Application startup script
├── start_beat.sh                # Celery beat scheduler
├── start_mailing.sh             # Email scheduling script
├── start_redis.sh               # Redis server script
└── start_worker.sh              # Celery worker script

```

## Roles

Quizgen has two main roles:

### 1. Admin (Quiz Master)

- Root access — the superuser of the app (no registration required).
- Only one admin exists in the system.

**User Management**

- Manages all registered users.
- Can activate or deactivate user accounts.

**Quiz Management**

- Create, edit, and delete:
  - Subjects
  - Chapters under subjects
  - Quizzes and quiz questions (MCQs with single correct option)
- Set quiz date and duration.

**Additional Features**

- View performance summary charts.
- Search functionality for users, subjects, chapters, and questions.
- Export and download CSV report of all completed quizzes, including scores and user data.

### 2. User

- Registers and logs in to the application.
- Can explore and attempt any available quiz.
- Key functionalities include:
  - Selecting subjects and chapters of interest.
  - Starting quizzes with a built-in timer.
  - Receiving instant results with a breakdown of correct and incorrect answers.
  - Viewing detailed quiz scores and performance history.
  - Accessing performance analytics through visual charts.
  - Downloading a CSV report of all quiz attempts and scores.
  - Receiving daily quiz reminders.
  - Getting a monthly activity report via email.

## Database Structure

### User Table

| Column        | Type         | Description              |
| ------------- | ------------ | ------------------------ |
| id            | Integer      | Primary Key              |
| email         | String       | Unique, Not Null         |
| password      | String       | Not Null                 |
| fullname      | String       | Not Null                 |
| qualification | String       | Nullable                 |
| dob           | Date         | Nullable                 |
| fs_uniquifier | String       | Unique, Not Null         |
| active        | Boolean      | Default True             |
| roles         | Relationship | Many-to-Many with `Role` |
| scores        | Relationship | One-to-Many with `Score` |

### Role Table

| Column      | Type    | Description      |
| ----------- | ------- | ---------------- |
| id          | Integer | Primary Key      |
| name        | String  | Unique, Not Null |
| description | String  | Not Null         |

### UserRoles Table

| Column  | Type    | Description          |
| ------- | ------- | -------------------- |
| id      | Integer | Primary Key          |
| user_id | Integer | ForeignKey to `User` |
| role_id | Integer | ForeignKey to `Role` |

### `Subject` Table

| Column      | Type         | Description                |
| ----------- | ------------ | -------------------------- |
| id          | Integer      | Primary Key                |
| name        | String       | Unique, Not Null           |
| description | String       | Not Null                   |
| active      | Boolean      | Default True               |
| chapters    | Relationship | One-to-Many with `Chapter` |

### `Chapter` Table

| Column      | Type         | Description             |
| ----------- | ------------ | ----------------------- |
| id          | Integer      | Primary Key             |
| subject_id  | Integer      | ForeignKey to `Subject` |
| name        | String       | Unique, Not Null        |
| description | String       | Not Null                |
| active      | Boolean      | Default True            |
| quizzes     | Relationship | One-to-Many with `Quiz` |

### `Quiz` Table

| Column        | Type         | Description                 |
| ------------- | ------------ | --------------------------- |
| id            | Integer      | Primary Key                 |
| chapter_id    | Integer      | ForeignKey to `Chapter`     |
| date_of_quiz  | Date         | Not Null                    |
| time_duration | String       | Not Null                    |
| remarks       | String       | Nullable                    |
| active        | Boolean      | Default True                |
| questions     | Relationship | One-to-Many with `Question` |
| scores        | Relationship | One-to-Many with `Score`    |

### `Question` Table

| Column         | Type    | Description          |
| -------------- | ------- | -------------------- |
| id             | Integer | Primary Key          |
| quiz_id        | Integer | ForeignKey to `Quiz` |
| question_text  | String  | Not Null             |
| options        | String  | Comma-separated      |
| correct_option | String  | Not Null             |
| question_title | String  | Not Null             |
| active         | Boolean | Default True         |

### `Score` Table

| Column    | Type     | Description          |
| --------- | -------- | -------------------- |
| id        | Integer  | Primary Key          |
| quiz_id   | Integer  | ForeignKey to `Quiz` |
| user_id   | Integer  | ForeignKey to `User` |
| timestamp | DateTime | Not Null             |
| score     | String   | Not Null             |

## ER Diagram

![Quiz_Master](https://github.com/user-attachments/assets/a6eb18aa-bd12-44b9-ad0e-27df5ffabc03)

## Technologies Used

### 🔧 Backend & API

- **Flask** – Lightweight Python web framework for backend logic.
- **Flask-SQLAlchemy** – ORM for seamless SQLite database interactions.
- **Flask-RESTful** – Simplifies RESTful API endpoint creation.
- **Flask-Security** – Provides authentication/authorization, replacing JWT with built-in role-based access control.
- **Flask-Caching** – Uses Redis to cache frequently accessed data and boost performance.
- **Flask-Excel** – Enables CSV/Excel file generation for quiz-related data export.

### 🖥️ Frontend

- **Vue.js** – Reactive, component-based front-end framework using Vue CLI for modular development.
- **Bootstrap** – For responsive design and pre-styled UI components.

### 🗃️ Database & Storage

- **SQLite** – Lightweight, file-based database used to manage user data, quizzes, scores, etc.

### ⚙️ Performance & Background Tasks

- **Redis** – Serves as a caching layer and message broker.
- **Celery** – Manages asynchronous tasks such as:
  - Daily quiz reminders
  - Monthly performance report emails
  - Exporting quiz results as CSV

### 🧪 Testing & Utilities

- **MailHog** – A local SMTP server used for testing email functionalities (e.g., reminders and reports).
- **Postman** – Used for API testing and verifying endpoints during development.
- **RedisInsight** – GUI tool for inspecting Redis keys and performance.
- **DB Browser for SQLite** – Visual interface for managing and browsing SQLite databases.

## Getting Started

### Prerequisites

Ensure you have these installed before proceeding:

1. **Redis** (v6.0+):
   ```bash
   brew install redis                # macOS
   ```
2. **Python** 3.13+:
    ```bash
    python3 --version                 # Verify installation
    ```
3. **Python Requirements**:
    ```bash
    pip install -r requirements.txt
    ```
4. **MailHog** (for local email testing):
    ```bash
    brew install mailhog              # macOS
    ```

### Launch Services

1. **Start Redis**
   ```bash
   ./start_redis.sh
   ```
2. **Start MailHog**:
    ```bash
    ./start_mailing.sh
    ```
3. **Start Celery Beat**:
    ```bash
    ./start_beat.sh
    ```
4. **Start Celery Worker** :
    ```bash
    ./start_worker.sh
    ```
5. **Launch Application** :
    ```bash
    ./start_application.sh
    ```
### Note:
- Run all shell scripts in current directory.
- Make all scripts executable first:
```bash
chmod +x *.sh
```

## Screenshots

![Screenshot 2025-04-24 at 1 48 55 AM](https://github.com/user-attachments/assets/c6b0031c-8305-422a-b146-afd8ed8decc0)
![Screenshot 2025-04-24 at 1 50 11 AM](https://github.com/user-attachments/assets/6dd9e3e8-c6f4-4a70-b623-ae1bbfdc3bd2)
![Screenshot 2025-04-24 at 1 50 40 AM](https://github.com/user-attachments/assets/c312f045-bbed-45c1-b663-76b7b8db9bb5)

### Admin
![Screenshot 2025-04-24 at 1 51 28 AM](https://github.com/user-attachments/assets/f036b5cb-6a4f-41ca-9abf-5c4e70a1f67e)
![Screenshot 2025-04-24 at 1 51 42 AM](https://github.com/user-attachments/assets/7d44395a-a428-4f9b-920d-38cd79e80c7a)
![Screenshot 2025-04-24 at 1 51 55 AM](https://github.com/user-attachments/assets/1b4e0ac0-746d-4220-96d6-4ce52b911247)
![Screenshot 2025-04-24 at 1 52 09 AM](https://github.com/user-attachments/assets/79aea30c-e690-4215-a0a3-5c1a060c73e5)
![Screenshot 2025-04-24 at 1 52 19 AM](https://github.com/user-attachments/assets/a101e162-14fa-4910-b789-43373332c8ed)
![Screenshot 2025-04-24 at 1 52 32 AM](https://github.com/user-attachments/assets/0dd011f7-8768-4579-a997-606e1db69307)
![Screenshot 2025-04-24 at 1 53 09 AM](https://github.com/user-attachments/assets/78628b99-4298-4f77-9388-6f989854da16)

### User
![Screenshot 2025-04-24 at 1 55 46 AM](https://github.com/user-attachments/assets/76f52804-ca6c-4566-942d-88b3ba77c428)
![Screenshot 2025-04-24 at 1 55 55 AM](https://github.com/user-attachments/assets/577f887e-8617-49e2-a7c8-99bc68d52e5e)
![Screenshot 2025-04-24 at 1 56 07 AM](https://github.com/user-attachments/assets/01652dac-8cc4-415d-8edb-0c080b909bd5)
![Screenshot 2025-04-24 at 1 56 31 AM](https://github.com/user-attachments/assets/8291a7b1-6125-406f-baeb-b44d542e2fec)
![Screenshot 2025-04-24 at 1 57 01 AM](https://github.com/user-attachments/assets/f7e57bef-fe62-4017-b9f2-5820545abb45)
![Screenshot 2025-04-24 at 1 57 36 AM](https://github.com/user-attachments/assets/1347fca6-2a5a-4f66-bb52-449e6bff9313)
![Screenshot 2025-04-24 at 1 57 53 AM](https://github.com/user-attachments/assets/6e098497-3d03-4bad-8fad-21ab6a2c0a37)
![Screenshot 2025-04-24 at 1 58 10 AM](https://github.com/user-attachments/assets/0ba4d5a0-2d75-424d-82a6-98bf7327f5fd)
![Screenshot 2025-04-24 at 1 58 24 AM](https://github.com/user-attachments/assets/77a0f889-588f-4a43-98e7-5b597eadb61d)

### Mails
![Screenshot 2025-04-24 at 2 00 52 AM](https://github.com/user-attachments/assets/be89c986-e8f8-458c-9cfd-e687de85cf2c)
![Screenshot 2025-04-24 at 2 01 32 AM](https://github.com/user-attachments/assets/77013a74-2123-4b82-92b0-7d6ee6cbdaee)

