# 📚 EduTech Course Directory

A robust, type-safe, full-stack educational ecosystem built using **React**, **TypeScript**, and **Node.js**. This platform features complex server-state management, an advanced elastic search discovery layout, secure payment gateways, and **automated AI assessment systems** designed to optimize learner retention and administrative velocity.

---

## 🚀 Live Demo

### 🖥️ Frontend Client
https://edutech-course-directory-three.vercel.app/

### ⚙️ Backend API
https://edutech-course-directory-api.onrender.com

---

### 🧠 Modern AI Integration Architecture

The platform uses a decoupled, serverless AI integration strategy designed to keep client bundles thin while ensuring predictable backend response formats:

* **Automated Lesson Evaluation Engine:** Integrates the official `@google/genai` SDK on the Express backend, linking course metadata matrices directly to **Gemini 2.5 Flash**.
* **Strict Schema Contracts:** Leverages Google's `responseMimeType: "application/json"` parameters to ensure the inference engine outputs perfect mathematical JSON quiz payloads, completely eliminating unstructured text extraction errors.
* **Interactive UI Streaming:** Implements a stateful, gamified client workspace using Tailwind CSS that parses AI structures on the fly, offering instant feedback, retrieval scores, and conceptual explanations directly alongside video playback streams.

---

## ✨ Features

### 👨‍🎓 Learner Features
- **Secure Authentication:** Identity protection powered by JWT and structured local persistence.
- **Advanced Course Discovery:** Real-time search by keywords, category filtering, structural pagination, and sorting by name or creation date.
- **💳 Seamless Stripe Checkout:** Integrated server-side billing workflows managing secure token handshakes, card authorization, and automated enrollment lifecycle completion.
- **⚡ Real-Time Support Desk:** Interactive, slide-out chat workspace with cursor-based pagination (before timestamp mapping) for endless scroll-up historical tracking without message duplication.
- **📥 Dual-Channel Notifications:** Live in-app alert drawers powered by Socket.io backed by transactional email dispatches for offline users.
- **Interactive Review Ecosystem:** Pinned user reviews with full inline **CRUD lifecycle** (Create, Read, Update, Delete) without page reloads.
- **Dynamic Metrics Breakdown:** Live calculations showing percentage star breakdowns and helpfulness upvote counters (`likes`).
- **Student Dashboard:** Custom, personalized workspace routes (`/dashboard`) managing enrollment records, system history, and profile configurations.

### 🛠️ Admin Features
- **Analytics KPI Center:** Dynamic dashboards tracking operational statistics like live revenue metrics, purchase conversion tracking, active user ratios, and course generation metrics.
- **Course Catalog Management (CRUD):** Complete programmatic creation, updates, and archival controls over course resources.
- **📢 Targeted Announcements:** Multi-channel broadcast pipelines saving persistent data while streaming real-time live push events to all active learners simultaneously.
- **User Auditing:** Dedicated directory tables listing learners with administrative protection middleware routes.

### 🧠 Backend Core & Security
- **Distributed Task Queueing:** High-performance background task execution managed by BullMQ and IORedis to handle heavy workloads asynchronously without blocking the primary HTTP thread.
- **Bi-Directional Event Pipes:** Centralized Socket.io instance initialized as a state-aware singleton to optimize system connections across active web threads.
- **💾 Automated Document Expiration (TTL):** Native MongoDB Time-To-Live index tracking that sweeps and purges transient notification documents after 7 days to minimize storage footprint.
- **Type-Safe Architecture:** Native TypeScript end-to-end integration across routes, schemas, and queries.
- **Strict Validation Layer:** Input parsing runtime protection enforced with schema-driven Zod middleware.
- **Defensive Production Guardrails:** Shielded infrastructure incorporating Helmet headers, rate-limiting, custom CORS rules, and database connection state sanitization.
- **Clean Execution Flow:** Decoupled layout utilizing centralized global error handling hooks and declarative Mongoose query pipelines (`.lean()`).

---

## 🛠️ Tech Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend** | React (Vite), TypeScript, Redux Toolkit, RTK Query, Socket.io-client, React Router DOM, Tailwind CSS |
| **Backend** | Node.js, Express.js, TypeScript, Socket.io (WebSockets), REST API Architecture, Zod Validation |
| **Asynchronous Task Queue** |	BullMQ, IORedis (Connection Pool Router) |
| **Caching & In-Memory Store** | Redis via official Node-Redis driver (redis) |
| **Inference Integration** | Official `@google/genai` SDK (Gemini 2.5 Flash) |
| **Transactional Email Engine** | Nodemailer (SMTP Transport Ecosystem) |
| **Payment Gateway** | Stripe API Core Ecosystem |
| **Database** | MongoDB Atlas, Mongoose ODM (TTL Index-enabled) |
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
- **Fetch All Courses:** Open catalog streaming with structured pagination support.
- **Advanced Querying:** Server-side search filtering by text tokens, categories, and creation dates.
- **Admin Management:** Secured endpoints for creating, updating, and archiving catalog listings. Automatically clears corresponding Redis caches and dispatches automated asynchronous BullMQ background tasks for email and notification blasts.

---

## Auth API
- **Register User:** Secure enrollment pipeline with automated initial role classification (`learner`).
- **Login User:** Credentials verification returning structured payload tokens.
- **JWT Token Generation:** Stateless identity protection verification attached to incoming header interceptors.

---

## Chat & Support API (REST & WebSockets)
- **Fetch Chat History:** Optimized cursor-based pagination tracking (?before=timestamp) ensuring seamless, duplicate-free scroll-up message rendering.
- **Admin Active Chats Grid:** High-performance database aggregation query restricted to recent message windows (30 days) to populate active support queues with learner profile details.
- **Double-Pane Socket.io Engine:** Bi-directional event streams allowing admins to attach to custom student channels, manage outward replies, and connect to a global admin broker room ("admin_global_room") that catches new customer inquiries instantly.

---

## Payments & Stripe API
- **Create Checkout Session:** Initiates secure transactional pipelines for incoming course seat requests.
- **Webhook Handlers:** Asynchronous endpoint processing card validation, verification states, and automated student enrollment drops.

---

## Notifications API (REST & WebSockets)
- **Fetch History:** Delivers historical alert documents sorted chronologically by receipt window.
- **Mark Status:** Updates reading progress state updates across database models instantly.
- **⚡ Socket.io Real-Time Pipeline:** Establishes low-latency WebSocket connection hooks to broadcast custom single-user or global learner notification alerts without heavy REST API polling loops.

---

## Dashboard API
- **Total Courses:** Real-time data aggregates detailing platform asset depth.
- **Total Learners:** Audit counters parsing registered learning profiles across database indexes.
- **Financial & Active Analytics:** Aggregates running calculations covering revenue metrics, item-purchase distributions, and system activity records.

---

# 🎯 Key Decisions & Architecture Strategy

- **Distributed Task Queueing with BullMQ & Redis:** Chose to offload high-latency processing tasks (like bulk email distributions and cross-system notification blasts) out of the main HTTP request-response cycle. Utilizing BullMQ backed by an isolated ioredis layer guarantees that administrative operations remain lightning-fast while automated backoffs and multi-attempt retries handle underlying mail server rate limits gracefully.
- **State Management & Caching with RTK Query:** Leveraged Redux Toolkit Query to abstract API data fetching, implementing automated cache invalidation (`tagTypes`) to keep server and client states synchronized without redundant network overhead.
- **WebSocket Synchronization over HTTP Polling:** Chose a persistent Socket.io configuration to drive notifications. Connecting client-side caches directly to incoming WebSocket streams via RTK Query's `onCacheEntryAdded` hook ensures real-time updates without forcing heavy page re-renders.
- **Asynchronous Webhook Processing for Transactions:** Decoupled the Stripe checkout pipeline from the main thread. Payment processing and user enrollment modifications execute out-of-band via secure transaction hooks, ensuring administrative UI response times stay under 200ms.
- **Automated Data Housekeeping via TTL Indexes:** Chosen native MongoDB Time-To-Live (TTL) indexing on notification schemas over building resource-heavy Node-CRON background jobs. This offloads transient document cleanup directly to the database layer, maintaining optimal query performance.
- **Modular Monolith Backend Structure:** Enforced a clean separation of concerns by isolating business logic into explicit Controllers, routing tables, Zod schema validation middlewares, and Mongoose model definitions.
- **Defensive API Gatekeeping:** Constructed dual-layered route guards. Open routes permit public catalog discovery, while downstream transactional, administrative, and real-time connection channels require active JWT verification and strict role-based checking (`admin` vs. `learner`).
- **Centralized Operational Error Handling:** Unified all asynchronous route processing inside an error-interceptor wrapper pipeline. This keeps controllers readable, free of repetitive `try/catch` boilerplate, and ensures database connection safety and uniform API error responses.
- **Utility-First Design with Tailwind CSS:** Selected Tailwind CSS to create a highly responsive, cohesive design token footprint. This allowed for seamless transition mapping between desktop right-aligned components and custom mobile viewport layout overlays.

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

- 🎥 Video course support
- 📱 Fully responsive admin dashboard

---
