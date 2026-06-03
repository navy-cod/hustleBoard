!\[CI\](https://github.com/YOUR\_USERNAME/hustleboard/actions/workflows/ci.yml/badge.svg)


\# HustleBoard


A full-stack student job board connecting students with internships, part-time roles, and freelance work. Built as a portfolio project demonstrating production-grade engineering across the full stack.


\*\*Live demo:\*\* \[hustleboard.vercel.app\](https://hustleboard.vercel.app)  

\*\*API base URL:\*\* \[hustleboard-api.onrender.com/health\](https://hustleboard-api.onrender.com/health)


---


\#\# Tech stack


| Layer | Technology | Purpose |

|---|---|---|

| Frontend | React 18 + Vite | UI — component architecture, routing, state |

| Styling | Tailwind CSS | Utility-first responsive design |

| Backend | Node.js + Express | REST API — routing, middleware, business logic |

| Database | PostgreSQL (Supabase) | Relational data — users, jobs, applications |

| Auth | JWT + bcrypt | Stateless authentication, hashed passwords |

| Deployment | Render (API) + Vercel (UI) | Cloud hosting with auto-deploy from GitHub |

| CI | GitHub Actions | Build and syntax checks on every push |


---


\#\# Features


- \*\*Role-based authentication\*\* — student, employer, and admin roles with JWT tokens and bcrypt-hashed passwords

- \*\*Job board\*\* — browse, search by keyword, filter by category and type, paginate results

- \*\*Applications system\*\* — students apply with a cover note, employers accept or reject, students track status

- \*\*Employer dashboard\*\* — post listings, view all applicants per listing, update application statuses inline

- \*\*Student dashboard\*\* — track all applications with live status updates and summary statistics

- \*\*Data structures\*\* — merge sort (O(n log n)) for client-side job sorting, in-memory hash map for O(1) category lookups

- \*\*Security\*\* — parameterised SQL queries, IDOR protection, duplicate application prevention at both application and database level


---


\#\# Architecture


\`\`\`

hustleboard/

├── client/                  React frontend (Vite)

│   ├── src/

│   │   ├── components/      Reusable UI components

│   │   ├── context/         AuthContext — global auth state

│   │   ├── lib/             mergeSort.js — DSA implementation

│   │   ├── pages/           Full page components

│   │   └── services/        API call layer (axios)

│

├── server/                  Node.js + Express API

│   ├── src/

│   │   ├── controllers/     HTTP request handlers

│   │   ├── db/              PostgreSQL connection pool

│   │   ├── lib/             categoryIndex.js — hash map DSA

│   │   ├── middleware/       JWT auth, role guard, validation

│   │   ├── routes/          Route definitions

│   │   └── services/        Business logic layer

│

└── database/

    └── migrations/          SQL schema files — version controlled

\`\`\`


---


\#\# API endpoints


| 	| 					| 		|   |

|---------- 	|-------					|-------|-------------------------------------- 		    

| ~~***Method ** | ~~***Path ** | ~~***Auth ** | ~~***Description** |
| - | - | - | - |
| ~~***POST  ** | ~~***\`/api/v1/auth/register\` ** | ~~*** — ** | ~~***Register a new user** |
| ~~***POST ** | ~~***\`/api/v1/auth/login\` ** | ~~*** — ** | ~~***Login and receive JWT ** |
| ~~***GET ** | ~~***\`/api/v1/auth/me\`** | ~~***🔒 any ** | ~~***Get current user profile ** |
| GET  | \`/api/v1/jobs\` |  | List jobs with search, filter, pagination | |
| ~~***GET 	** | ~~***\`/api/v1/jobs/:id\` ** |  —  | ~~***Get single job detail ** |
| ~~***POST ** | ~~***\`/api/v1/jobs\` ** | ~~***🔒 employer ** | ~~***Create a job listing** |
| ~~***PATCH ** | ~~***\`/api/v1/jobs/:id\` ** | ~~***🔒 owner ** | ~~***Update a listing ** |
| ~~***DELETE** | ~~***\`/api/v1/jobs/:id\` ** | ~~***🔒 owner ** | ~~***Delete a listing ** |
| ~~***GET 	** | ~~***\`/api/v1/jobs/mine\`** | ~~***🔒 employer** | ~~***Employer's own listings ** |
| ~~***GET ** | ~~***\`/api/v1/categories\`** | ~~*** — 	** | ~~***List all categories ** |
| ~~***GET ** | ~~*** \`/api/v1/category-index/summary\` ** | ~~*** — ** | ~~***Category job counts (hash map)** |
| ~~***GET ** | ~~***\`/api/v1/category-index/:slug\` ** | ~~*** — ** | ~~***O(1) category lookup ** |
| ~~***POST** | ~~***\`/api/v1/applications\` ** | ~~***🔒 student** | ~~***Apply to a job** |
| ~~***GET** | ~~***\`/api/v1/applications/mine\` ** | ~~***🔒 student ** | ~~***Student's applications ** |
| ~~***GET** | ~~***\`/api/v1/applications/job/:id\` ** | ~~***🔒 employer** | ~~***Applicants for a listing** |
| ~~***PATCH** | ~~***\`/api/v1/applications/:id/status\` 	** | ~~***🔒 employer** | ~~***Update application status ** |


---


\#\# Data structures


\*\*Merge sort\*\* (\`client/src/lib/mergeSort.js\`) — implemented from scratch with custom comparators for sorting job listings by date, title, and type. O(n log n) guaranteed, stable sort. Applied client-side so reordering costs zero network round-trips.


\*\*Hash map — category index\*\* (\`server/src/lib/categoryIndex.js\`) — built on server startup from the categories and jobs tables. Provides O(1) category lookup by slug. Eliminates per-request JOIN queries for category aggregation. Demonstrates the caching principle used by Redis and production CDNs.


---


\#\# Running locally


\#\#\# Prerequisites

- Node.js 20+

- PostgreSQL 14+


\#\#\# Setup


\`\`\`bash

git clone https://github.com/YOUR\_USERNAME/hustleboard.git

cd hustleboard


\# Copy and fill in environment variables

cp .env.example .env

\# Edit .env with your local PostgreSQL credentials


\# Run database migrations

psql -U postgres -d hustleboard\_dev -f database/migrations/001\_create\_users.sql

psql -U postgres -d hustleboard\_dev -f database/migrations/002\_create\_categories.sql

psql -U postgres -d hustleboard\_dev -f database/migrations/003\_create\_jobs.sql

psql -U postgres -d hustleboard\_dev -f database/migrations/004\_create\_applications.sql


\# Start the backend

cd server && npm install && npm run dev


\# Start the frontend (new terminal)

cd client && npm install && npm run dev

\`\`\`


Frontend: \`http://localhost:5173\`  

Backend: \`http://localhost:3000\`


---


\#\# Engineering decisions


\*\*Why JWT over sessions?\*\* JWTs are stateless — the server does not need to store session data in the database. Each token is self-contained and verified cryptographically. This scales horizontally without shared session storage.


\*\*Why bcrypt cost factor 12?\*\* SHA-256 can hash billions of passwords per second on modern GPU hardware. bcrypt at cost 12 takes ~250ms per hash, making offline brute-force attacks computationally infeasible on a leaked database.


\*\*Why merge sort over Array.prototype.sort?\*\* Merge sort is guaranteed O(n log n) worst case (quicksort degrades to O(n²)). It is stable — equal elements preserve original order. Implementing it from scratch demonstrates deliberate algorithmic choice rather than relying on a black-box built-in.


\*\*Why parameterised queries everywhere?\*\* SQL injection is consistently in the OWASP Top 10. Using \`$1, $2\` placeholders in \`pg\` means user input is never interpreted as SQL syntax — the driver handles escaping at the protocol level.
