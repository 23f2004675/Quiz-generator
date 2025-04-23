# Quizgen

Quizgen is a dynamic web application designed to create, manage, and master quizzes effortlessly. It is a multi-user app (one requires an administrator and other users) that acts as an exam preparation site for multiple courses.

[![Demo Video](https://img.shields.io/badge/Video_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://drive.google.com/file/d/16PTD8y75gmB-HCmemrKdMZSep47nk59_/view?usp=sharing)

![Quizgen Screenshot](https://github.com/user-attachments/assets/your-screenshot-path-here)  
\_(Add a screenshot of your application's homepage or interface)

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
  - [Installation](#installation)
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



