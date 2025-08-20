# Inventory Management System - Frontend (Qwik + Tailwind)

This is the Qwik-based frontend for the Inventory Management System.

Features implemented:
- Authentication (login/signup - mocked, stored in localStorage)
- Role-based UI (Admin/User)
- Products: view, search, filter; Admin CRUD via modal
- Categories & Locations (Admin CRUD)
- Dashboard with basic charts (category breakdown, low inventory)
- Reports with stock by location
- Reusable UI components (Sidebar, Navbar, Card, Table, Modal, FormFields)
- Qwik stores/context for app state
- Smooth transitions/animations
- Responsive, minimal UI using TailwindCSS and DaisyUI

Getting started:
1. npm install
2. npm run dev
3. Open http://localhost:3000

Login:
- Use any email. If email contains "admin" (e.g. admin@example.com), role is Admin. Otherwise, role is User.
- Data is demo-only and stored in memory.
