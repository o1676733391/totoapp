[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YHSq4TPZ)
# StudyFlow – Student Time Management Solution

👀 Please Check ASSIGNMENT.md file in this repository for assignment requirements.

## 🚀 Project Setup & Usage
**How to install and run your project:**  
- `npm install`  
- `cd server && npm install`  
- `npm run dev` (for frontend)  
- `cd server && npm start` (for backend)

## 🔗 Deployed Web URL or APK file
[https://totoapp-two.vercel.app/](https://totoapp-two.vercel.app/)

## 🎥 Demo Video
**Demo video link (≤ 2 minutes):**  
✍️ [Paste your video link here]

## 💻 Project Introduction

### a. Overview
StudyFlow is a web application designed to help Vietnamese university students manage their time and tasks efficiently. The app provides a simple, intuitive interface for tracking tasks, focusing on productivity, and visualizing progress—all tailored to the real needs of students juggling classes, projects, and life.

### b. Key Features & Function Manual
- **Full CRUD Operations:** Create, read, update, and delete tasks (with title, priority, due date, and completion status).
- **Persistent Storage:** All tasks are stored in MongoDB Atlas (cloud database) for reliability and accessibility.
- **Three Views:**
  - **Tasks View:** List and manage all tasks.
  - **Focus Timer:** Pomodoro timer to boost focus and productivity.
  - **Progress View:** Visual stats and analytics of completed, pending, high-priority, and due-today tasks.
- **Time/Date Handling:** Each task can have a due date. The app highlights tasks due today and tracks completion over time.
- **Handles 20+ Items:** The UI and backend are optimized to handle large numbers of tasks smoothly.

### c. Unique Features (What’s special about this app?)
- Clean, modern UI for easy task management
- Pomodoro timer for focus sessions
- Progress analytics to visualize productivity
- Cloud database for persistent, cross-device access

### d. Technology Stack and Implementation Methods
- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js + Express + Mongoose
- **Database:** MongoDB Atlas (cloud)
- **Deployment:** Vercel (frontend & API)

### e. Service Architecture & Database structure (when used)
- **Architecture:**
  - Frontend and backend are separated for scalability.
  - Backend exposes RESTful API endpoints for tasks.
  - Frontend communicates with backend via `/api` routes (proxied in development).
- **Database:**
  - MongoDB Atlas with a `tasks` collection in the `totoapp` database.

## 🧠 Reflection

### a. If you had more time, what would you expand?
- Add user authentication for personal task lists
- Add notifications/reminders for due tasks
- Add calendar and timeline views
- Improve mobile responsiveness

### b. If you integrate AI APIs more for your app, what would you do?
- Smart task suggestions based on user habits
- Natural language input for task creation
- AI-powered productivity analytics and recommendations

## ✅ Checklist
- [x] Code runs without errors  
- [x] All required features implemented (add/edit/delete/complete tasks)  
- [x] All ✍️ sections are filled
