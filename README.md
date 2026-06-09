<div align="center">

# HustleBoard

A full-stack student job board connecting students with internships, part-time roles, and freelance work.

[![CI](https://github.com/navy-cod/hustleBoard/actions/workflows/ci.yml/badge.svg)](https://github.com/navy-cod/hustleBoard/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

**[Live Demo](https://hustle-board-three.vercel.app)** · **[API](https://hustleboard-api.onrender.com/health)**

</div>

---

## Overview

HustleBoard is a role-based job board platform with three user types — **student**, **employer**, and **admin**. Students browse and apply to listings; employers post jobs and manage applicants; all access is enforced server-side via JWT and role middleware.

## Tech Stack

| Layer      |          Technology          |
|------------|------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS |
| Backend    | Node.js, Express             |
| Database   | PostgreSQL (Supabase)        |
| Auth       | JWT, bcrypt                  |
| Deployment | Render (API) · Vercel (UI)   |
| CI         | GitHub Actions               |

## Features

- JWT authentication with bcrypt password hashing
- Role-based access control across all API endpoints
- Job search, filtering by category and type, and pagination
- Application system with cover notes and status tracking
- Employer dashboard with inline accept / reject actions
- Merge sort (O(n log n)) for client-side job sorting
- In-memory hash map for O(1) category lookups at the server
- Parameterised queries and IDOR protection throughout

## Getting Started

```bash
git clone https://github.com/navy-cod/hustleBoard.git
cd hustleBoard
cp .env.example .env          # fill in your local DB credentials
```

```bash
# Run migrations
psql -U postgres -d hustleboard_dev -f database/migrations/001_create_users.sql
psql -U postgres -d hustleboard_dev -f database/migrations/002_create_categories.sql
psql -U postgres -d hustleboard_dev -f database/migrations/003_create_jobs.sql
psql -U postgres -d hustleboard_dev -f database/migrations/004_create_applications.sql
```

```bash
cd server && npm install && npm run dev   # http://localhost:3000
cd client && npm install && npm run dev  # http://localhost:5173
```

## API

Base URL: `https://hustleboard-api.onrender.com/api/v1`

| Method | Endpoint                   | Auth        |
|--------|----------------------------|-------------|
| POST   | `/auth/register`           |     —       |
| POST   | `/auth/login`              |     —       |
| GET    | `/jobs`                    |     —       |
| GET    | `/jobs/:id`                |     —       |
| POST   | `/jobs`                    | 🔒 employer |
| PATCH  | `/jobs/:id`                | 🔒 owner    |
| DELETE | `/jobs/:id`                | 🔒 owner    |
| POST   | `/applications`            | 🔒 student  |
| GET    | `/applications/mine`       | 🔒 student  |
| PATCH  | `/applications/:id/status` | 🔒 employer |

## Environment Variables

| Variable         | Required in         |
|------------------|---------------------|
| `DATABASE_URL`   | Production (Render) |
| `JWT_SECRET`     | Both                |
| `JWT_EXPIRES_IN` | Both                |
| `CLIENT_URL`     | Production (Render) |
| `VITE_API_URL`   | Production (Vercel) |

See `.env.example` for the full list.

---

<div align="center">

Built by [navY](https://github.com/navy-cod) · [MIT License](LICENSE)

</div>
