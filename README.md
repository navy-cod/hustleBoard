# HustleBoard

A full-stack student job board where students find internships and gig work, and employers post listings and manage applications.

Built as a portfolio project to demonstrate full-stack engineering skills across backend, frontend, database design, authentication, and deployment.

## Tech stack

| Layer        |       Technology               |
| ------------ | -------------------------------|
| Frontend     | React 18 + Vite + Tailwind CSS |
| Backend      | Node.js + Express              |
| Database     | PostgreSQL                     |
| Auth         | JWT (JSON Web Tokens) + bcrypt |
| Deployment   | Render.com (API) + Vercel (UI) |


## Features

- Role-based authentication — student, employer, admin

- Job listings with search, filter by category, and pagination

- Application system with status tracking

- Employer dashboard — post and manage listings

- Student dashboard — track all applications

## Project structure

hustleboard/ 
 ├── client/          React frontend (Vite) 
 ├── server/          Node.js + Express API 
 └── database/        SQL migration files 


## Running locally

\`\`\`bash

# Clone the repo

git clone (https://github.com/navy-cod/hustleboard.git) cd hustleboard

# Start the backend

cd server && npm install && npm run dev

# Start the frontend (new terminal)

cd client && npm install && npm run dev \`\`\`

Requires Node.js 18+ and PostgreSQL 14+.

## Status

In active development. See the project roadmap in the wiki.

