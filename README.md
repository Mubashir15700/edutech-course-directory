# 📚 EduTech Course Directory

A responsive frontend application built using React and TypeScript that allows users to browse, search, filter, and paginate through a list of courses.

## 🚀 Live Demo
https://edutech-course-directory-three.vercel.app/

---

## 🧠 Features
- 📦 Display courses in a clean card layout
- 🔍 Search courses by name
- 🏷️ Filter courses by category
- 🔢 Client-side pagination
- ⏳ Loading and error states
- ⚡ Fast and responsive UI

---

## 🛠️ Tech Stack
- **React (Vite)**
- **TypeScript**
- **Redux Toolkit**
- **RTK Query**
- **Tailwind CSS**

---

## 📂 Project Structure
src/
├── app/ # Redux store setup
├── features/
│ └── courses/ # RTK Query API
├── components/ # Reusable UI components
├── pages/ # Page components
├── App.tsx # Main app logic
└── main.tsx # Entry point

---

## 🔌 API Handling
- Used **RTK Query** to fetch course data
- Mocked API using a static JSON file (`courses.json`)
- Simulated network delay to demonstrate loading states

---

## 🎯 Key Decisions
- Used **client-side filtering and pagination** for performance and simplicity
- Chose **pagination over infinite scroll** for better control and usability
- Used **Tailwind CSS** for rapid UI development and consistency

---

## 📦 Installation
```bash
git clone https://github.com/Mubashir15700/edutech-course-directory.git
cd edutech-course-directory
npm install
npm run dev
```

---

## 🚀 Deployment
Deployed using Vercel
