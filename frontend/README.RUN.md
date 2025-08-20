# IMS Frontend - Run Guide

Prerequisites:
- Node.js 18+
- npm

Install:
- npm install

Development:
- npm run dev
  - Opens http://localhost:3000

Build:
- npm run build
- npm run preview

Auth Roles:
- Login with any email.
- Emails containing "admin" get Admin role (e.g., admin@example.com).
- Others get User role.

Environment:
- Copy .env.example to .env and set VITE_API_URL when integrating a backend.
