# 📚 EduTech Course Directory

A robust, full-stack educational ecosystem built using the MERN stack and TypeScript. This platform empowers learners to discover courses, securely purchase and enroll in programs, and share course reviews, while providing administrators with an analytical management dashboard to handle platform growth.A robust, full-stack educational ecosystem built using the MERN stack and TypeScript. This platform empowers learners to discover courses, securely purchase and enroll in programs, and share course reviews, while providing administrators with an analytical management dashboard to handle platform growth.

---

## 🚀 Live Demo

### 🖥️ Frontend Client
https://edutech-course-directory-three.vercel.app/

### ⚙️ Backend API
https://edutech-course-directory-api.onrender.com

---

## ✨ Features

### 👨‍🎓 Learner Features
- **Secure Authentication:** Identity protection powered by JWT and structured local persistence.
- **Advanced Course Discovery:** Real-time search by keywords, category filtering, structural pagination, and sorting by name or creation date.
- **💳 Seamless Course Payments & Enrollment:** Fully integrated checkout architecture allowing instant course purchasing, billing confirmation, and immediate student enrollment tracking.
- **Interactive Review Ecosystem:** Pinned user reviews with full inline **CRUD lifecycle** (Create, Read, Update, Delete) without page reloads.
- **Dynamic Metrics Breakdown:** Live calculations showing percentage star breakdowns and helpfulness upvote counters (`likes`).
- **Student Space:** Profile tracking dropdowns, notifications UI shell, and clear registration access points.

### 🛠️ Admin Features
- **Analytics KPI Center:** Dynamic dashboards tracking operational statistics like revenue metrics, active user ratios, and course generation metrics.
- **Course Catalog Management (CRUD):** Complete programmatic creation, updates, and archival controls over course resources.
- **User Auditing:** Dedicated directory tables listing learners with administrative protection middleware routes.
- **Flexible UI Architecture:** Clean, decoupled data-table models built for reusability.

### 🧠 Backend Core & Security
- **Type-Safe Architecture:** Native TypeScript end-to-end integration across routes, schemas, and queries.
- **Strict Validation Layer:** Input parsing runtime protection enforced with schema-driven Zod middleware.
- **Defensive Production Guardrails:** Shielded infrastructure incorporating Helmet headers, rate-limiting, custom CORS rules, and database connection state sanitization.
- **Clean execution flow:** Decoupled layout utilizing centralized global error handling hooks and declarative Mongoose query pipelines (`.lean()`).

---

## 🛠️ Tech Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend** | React (Vite), TypeScript, Redux Toolkit, RTK Query, React Router DOM, Tailwind CSS |
| **Backend** | Node.js, Express.js, TypeScript, REST API Architecture, Zod Validation |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Tooling** | Git, dotenv, ts-node, Morgan Logging |

---

## 📂 Project Structure
```txt
edutech-course-directory/
├── client/                 # Frontend React Application
│   src/
│   ├── components/         # Reusable UI Components
│   ├── pages/              # Course Details, Dashboards, Discovery views
│   └── features/           # RTK Query API Slices (courseApi, etc.)
├── server/                 # Backend Express API
│   src/
│   ├── controllers/        # Request Handlers (Course, Review, Auth)
│   ├── middleware/         # Auth guards, Zod validators, Errors handlers
│   ├── models/             # Database Schemas (User, Course, Review)
│   └── seed/               # Autonomous DB Population Scripts
└── README.md
```

# 🔌 API Features

## Courses API
- Fetch all courses
- Pagination
- Search & filtering
- Create course
- Update course
- Delete course

---

## Auth API
- Register user
- Login user
- JWT token generation

---

## Dashboard API
- Total courses
- Total learners
- Active users statistics

---

# 🎯 Key Decisions

- Used RTK Query for efficient API caching and state management
- Implemented reusable components for scalability
- Structured backend using controllers, routes, middleware, and validations
- Used protected and public routes for access control
- Added centralized error handling for cleaner controllers
- Chose Tailwind CSS for rapid UI development and consistency

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/Mubashir15700/edutech-course-directory.git
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Backend Setup

```bash
cd server
npm install
npm run dev
```

---

## 📦 Installation
```bash
git clone https://github.com/Mubashir15700/edutech-course-directory.git
cd edutech-course-directory
npm install
npm run dev
```

# 🚀 Deployment

## Frontend
- Deployed on Vercel

## Backend
- Deployed on Render

## Database
- MongoDB Atlas

---

# 📸 Future Improvements

- 📧 Email notifications
- 📈 Advanced analytics dashboard
- 🎥 Video course support
- 📱 Fully responsive admin dashboard

---
