<a href="https://coordina.alessandro-argenziano.com" target="_blank">
<picture>
    <source srcset="https://raw.githubusercontent.com/alessandro-arg/assets/refs/heads/main/coordina-white.svg" media="(prefers-color-scheme: dark)">
    <img src="https://raw.githubusercontent.com/alessandro-arg/assets/refs/heads/main/coordina-black.svg" width="200" alt="Coordina logo" />
  </picture>
</a>
  
<h1>  
Project &amp; Task Management Platform
</h1>

![Repo Size](https://img.shields.io/github/repo-size/alessandro-arg/coordina?color=%2300d26a&style=for-the-badge)
![Last Commit](https://img.shields.io/github/last-commit/alessandro-arg/coordina?style=for-the-badge)
![Issues](https://img.shields.io/github/issues/alessandro-arg/coordina?style=for-the-badge)

Coordina is a modern, visually polished **project and task management platform**, inspired by tools like Jira, Trello, and Linear. Built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, **Hono**, **Appwrite**, and **React Query**, it offers an intuitive Kanban workflow, analytics dashboards, full‑calendar scheduling, and flexible project organization.

> A sleek and powerful way to plan, track, and manage tasks - individually or collaboratively.

### 🌍 Live Demo

🚧 **First deployment: 11/25** </br>
🖥  <a href="https://coordina.alessandro-argenziano.com" target="_blank">
**Coordina**
</a>

##

### ✨ Key Features

| Feature                       | Description                                                          |
| ----------------------------- | -------------------------------------------------------------------- |
| **📌 Kanban Board**           | Drag‑and‑drop tasks using `@hello‑pangea/dnd`.                       |
| **🗂 Project‑Based Structure** | Create multiple projects, each with tasks, metadata & members.       |
| **🎯 Task Management**        | Priority, due dates, labels, descriptions, comments.                 |
| **📅 Full Calendar View**     | Visualise tasks/events in a calendar using `react‑big‑calendar`.     |
| **📊 Analytics & Insights**   | Charts using Recharts for progress, workload, time tracking.         |
| **🎨 Modern UI**              | Radix UI components + Tailwind CSS + Lucide icons.                   |
| **🌓 Dark / Light Themes**    | Theme switching with `next‑themes`.                                  |
| **🔐 Authentication**         | Appwrite‑powered auth with multi‑user support.                       |
| **⚡ Fast Data Layer**        | React Query + Zod validation for performant state & data management. |
| **📱 Fully Responsive**       | Optimised for desktop and mobile devices.                            |

##

### 🛠 **Tech Stack**

#### Frontend

- **Next.js** (v16.0.1)
- **React** (v19.2.0)
- **Tailwind CSS** (v4)
- **Radix UI**, **Lucide Icons**, **React Icons**
- **React Hook Form + Zod**
- **React Query**
- **react‑big‑calendar**, **Recharts**

#### Backend / API

- **Hono** (API routing)
- **Appwrite (Databases & auth)**
- Validation via `@hono/zod‑validator`

##

### 🔧 Installation

```bash
git clone https://github.com/alessandro-arg/coordina.git
cd coordina
npm install
npm run dev
```

Then open:

```
http://localhost:3000
```

### ⚙️ Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_APP_URL = http://localhost:3000
NEXT_PUBLIC_APPWRITE_ENDPOINT =
NEXT_PUBLIC_APPWRITE_PROJECT =
NEXT_PUBLIC_APPWRITE_DATABASE_ID =
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID =
NEXT_PUBLIC_APPWRITE_MEMBERS_ID =
NEXT_PUBLIC_APPWRITE_PROJECTS_ID =
NEXT_PUBLIC_APPWRITE_TASKS_ID =
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID =
NEXT_APPWRITE_KEY =
```

##

### 📂 Project Structure

```text
/
├─ app/
│  ├─ (auth)/              # login, register, reset, etc.
│  ├─ (dashboard)/         # main app shell after login (sidebar + content)
│  ├─ (standalone)/        # landing/marketing or standalone pages
│  ├─ api/
│  │   └─ [[...route]]/    # Hono/RPC handler
│  ├─ layout.tsx           # root layout (theme, QueryProvider, etc.)
│  └─ globals.css          # global styles entry
│
├─ features/               # DOMAIN LOGIC (where most app code lives)
│  ├─ auth/                # login flows, auth hooks & forms
│  ├─ workspaces/          # workspaces list, switcher, membership logic
│  ├─ projects/            # project pages, project board wiring
│  ├─ tasks/               # task details, kanban logic, filters
│  └─ calendar/            # react-big-calendar integration (views, events)
│
├─ components/             # shared UI building blocks
│  ├─ ui/                  # buttons, inputs, modals, date-picker, etc.
│  └─ layout/              # sidebar, topbar, navigation, shell components
│
├─ hooks/
│  └─ use-confirm.tsx      # generic/global hooks only
│
├─ lib/
│  ├─ appwrite.ts          # Appwrite client + config
│  ├─ rpc.ts               # RPC client / fetch helper
│  ├─ session-middleware.ts# auth/session helpers
│  └─ utils.ts             # small, generic utilities
│
├─ public/                 # images, icons, static assets
└─ README.md
```

##

### 📜 Scripts

| Command         | Action                   |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build production version |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

### 🚀 Deployment

#### **Deploy to Vercel (Recommended)**

```bash
npm install -g vercel
vercel
```

Ensure environment variables are set in the Vercel dashboard.

##

### 🤝 Contributing

```bash
git checkout -b feature/YourFeature
git commit -m "feat: add YourFeature"
git push origin feature/YourFeature
```

Open a Pull Request once done.

##

Made with ❤️ by **Alessandro Argenziano**
