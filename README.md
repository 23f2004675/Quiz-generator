# Quizgen

Quizgen is a dynamic web application designed to create, manage, and master quizzes effortlessly. It is a multi-user app (one requires an administrator and other users) that acts as an exam preparation site for multiple courses.

[![Demo Video](https://img.shields.io/badge/Video_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://drive.google.com/file/d/16PTD8y75gmB-HCmemrKdMZSep47nk59_/view?usp=sharing)

![Quizgen Screenshot](https://github.com/user-attachments/assets/your-screenshot-path-here)  
\_(Add a screenshot of your application's homepage or interface)

## Table of Contents

- [Roles](#roles)
- [Database Structure](#database-structure)
  - [User Table Schema](#user-table-schema)
  - [Quiz Table Schema](#quiz-table-schema)
  - [Question Table Schema](#question-table-schema)
  - [Score Table Schema](#score-table-schema)
  - [Subject Table Schema](#subject-table-schema)
  - [Chapter Table Schema](#chapter-table-schema)
  - [Role Table Schema](#role-table-schema)
  - [UserRoles Table Schema](#userroles-table-schema)
- [ER Diagram](#er-diagram)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Screenshots](#screenshots)

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

## 🗃️ Database Structure

### `User` Table

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

### `Role` Table

| Column      | Type    | Description      |
| ----------- | ------- | ---------------- |
| id          | Integer | Primary Key      |
| name        | String  | Unique, Not Null |
| description | String  | Not Null         |

### `UserRoles` Table

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

# er diagram
![Quiz_Master](https://github.com/user-attachments/assets/a6eb18aa-bd12-44b9-ad0e-27df5ffabc03)


