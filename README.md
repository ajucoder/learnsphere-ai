# LearnSphere AI - Production-Quality NCERT-Aligned AI Learning Platform (Classes 6-8)

LearnSphere AI is a full-stack, responsive, and accessible AI-powered educational platform engineered specifically for students in Classes 6, 7, and 8.

---

> [!IMPORTANT]
> **Educational Alignment & Non-Official Disclaimer**:
> LearnSphere AI is an independent educational tool designed to align with Classes 6, 7, and 8 curricula. It is not officially owned, operated, endorsed, or affiliated with the National Council of Educational Research and Training (NCERT).

---

## 🌟 Key Features

1. **4 Comprehensive User Roles**:
   - **Student Dashboard**: Class selection (Class 6-8), Subject cards, Chapter-wise lessons, educational videos, practice questions, gamified XP, daily streaks, badges, and active assignment submission.
   - **Teacher Dashboard**: Class/subject management, AI Quiz Generator (generates 3 NCERT questions on demand), assignment creation, student XP roster, and class performance analytics.
   - **Parent Dashboard**: Child progress tracking, quiz score accuracy breakdown, weekly study hours chart, and AI safety report.
   - **Administrator Console**: System metrics, user management (Role edit/delete), AI token monitoring, and audit logs.

2. **RAG-Powered AI Tutor & Safety Guardrails**:
   - **RAG Architecture**: Retrieves NCERT textbook knowledge chunks (`server/data/ncertKnowledgeBase.json`) and injects them into system prompts.
   - **Guided Learning Filter**: If a student asks the AI to solve graded homework, the AI guardrail automatically provides step-by-step hints and encouraging explanations instead of giving direct raw answers.
   - **Quick Actions**: "Explain concept", "Give an example", "Give me a hint", "Summarize lesson", "Quiz me".

3. **Gamification & Quizzes**:
   - Multiple choice and True/False questions with live countdown timers, instant explanations, XP awards (+20 XP for lesson complete, +80 XP for 100% quiz score), and badge unlocks.

---

## 📁 Complete Project Structure

```
learnsphere-ai/
├── package.json
├── README.md
├── server/
│   ├── package.json
│   ├── .env.example
│   ├── index.js
│   ├── config/
│   │   ├── db.js
│   │   └── constants.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── aiSafety.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── services/
│   │   ├── aiService.js
│   │   ├── ragService.js
│   │   └── seedService.js
│   ├── data/
│   │   └── ncertKnowledgeBase.json
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── teacherController.js
│   │   ├── parentController.js
│   │   ├── adminController.js
│   │   ├── quizController.js
│   │   ├── assignmentController.js
│   │   └── aiController.js
│   └── routes/
│       ├── auth.routes.js
│       ├── student.routes.js
│       ├── teacher.routes.js
│       ├── parent.routes.js
│       ├── admin.routes.js
│       ├── quiz.routes.js
│       ├── assignment.routes.js
│       └── ai.routes.js
└── client/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── components/
        │   ├── common/ (Navbar, Footer, DisclaimerBanner)
        │   ├── ai/ (AITutorChat)
        │   └── quiz/ (QuizRunner)
        ├── context/ (AuthContext, ThemeContext, ToastContext)
        ├── pages/ (HomePage, LoginPage, RegisterPage, StudentDashboard, TeacherDashboard, ParentDashboard, AdminDashboard, ClassDetailsPage, ChapterViewPage, AITutorPage)
        └── services/ (api.js)
```

---

## 🚀 Quick Start Guide

### 1. Installation

From the project root:

```bash
# Install root, server, and client dependencies
npm run install:all
```

Or manually:

```bash
cd server && npm install
cd ../client && npm install
```

---

### 2. Environment Variables Setup

Create a `.env` file in the `server` directory (or rename `.env.example`):

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=learnsphere_super_secret_jwt_key_2026_ncert_class6_8
GEMINI_API_KEY=your_optional_gemini_api_key
MONGODB_URI=mongodb://127.0.0.1:27017/learnsphere_ai
```

*Note: If `MONGODB_URI` or `GEMINI_API_KEY` are omitted, LearnSphere AI will automatically operate on an intelligent in-memory educational mock store so the app works immediately out of the box!*

---

### 3. Running the Platform

To start the backend server:

```bash
npm run server
```

To start the React client:

```bash
npm run client
```

Open your browser at `http://localhost:5173`.

---

## 🔑 Demo Account Credentials

Use the **1-Click Demo Persona Buttons** on the login page or enter:

- **Student**: `student@learnsphere.ai` | Password: `password123`
- **Teacher**: `teacher@learnsphere.ai` | Password: `password123`
- **Parent**: `parent@learnsphere.ai` | Password: `password123`
- **Admin**: `admin@learnsphere.ai` | Password: `password123`

---

## 🛠️ REST API Endpoints Overview

| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | JWT Authenticate user | Public |
| `GET` | `/api/student/chapters` | Fetch Class 6-8 NCERT chapters | Public / Student |
| `GET` | `/api/student/progress` | Fetch XP, streak, badges & quiz history | Student |
| `POST` | `/api/student/lesson/complete` | Complete lesson (+20 XP) | Student |
| `GET` | `/api/quizzes/by-chapter` | Fetch chapter quizzes | Student |
| `POST` | `/api/quizzes/:quizId/submit` | Submit quiz & calculate score/XP | Student |
| `POST` | `/api/assignments/:id/submit` | Submit student assignment | Student |
| `POST` | `/api/ai/tutor` | RAG-assisted AI Tutor query | Student / All |
| `GET` | `/api/teacher/analytics` | Teacher class performance metrics | Teacher / Admin |
| `POST` | `/api/teacher/generate-quiz` | AI Quiz Generator | Teacher / Admin |
| `GET` | `/api/parent/overview` | Child progress & AI safety report | Parent / Admin |
| `GET` | `/api/admin/analytics` | System metrics & audit logs | Admin |

---

## 📋 Checklists

### Security Checklist
- [x] Passwords hashed with bcrypt (`saltRounds = 10`)
- [x] JWT token authentication with expiration
- [x] Role-Based Access Control (RBAC) enforced on Express endpoints
- [x] Express Rate Limiting on API and AI endpoints
- [x] Helmet security headers active
- [x] Input moderation & prompt injection filter enabled

### Accessibility Checklist
- [x] Semantic HTML5 layout tags (`<nav>`, `<main>`, `<section>`, `<footer>`)
- [x] High-contrast colors for text & interactive buttons
- [x] Keyboard focus ring indicators (`:focus-visible`)
- [x] Responsive layout tested across mobile (375px), tablet (768px), and desktop (1280px+)

### Production Readiness Checklist
- [x] Dual-mode DB handler (MongoDB Atlas URI + Mock fallback)
- [x] AI Provider integration (Gemini API + intelligent RAG fallback)
- [x] Explicit non-official NCERT disclaimers in banner and footer
- [x] Clean, error-free Vite React build configuration
