# To-Do List App (MERN)

## Structure
```
todo-app/
  server/   Express + MongoDB API
  client/   React (Vite) frontend
```

## Setup (same pattern as the quiz app)

1. `cd server`, `cp .env.example .env`, fill in `MONGO_URI` and `JWT_SECRET`, then `npm install` and `npm run dev`.
2. `cd client`, `cp .env.example .env`, then `npm install` and `npm run dev`.
3. Open `http://localhost:5173`, register, and start adding tasks.

## Features
- JWT auth (register/login), each user has their own private task list.
- Create tasks with priority (low/medium/high) and an optional due date.
- Filter: All / Active / Completed.
- Swipe a task right to complete it, left to delete it (works with touch or mouse drag).
- Animated stats (total/active/completed), confetti on completing a task.
- 4 switchable color themes with an animated wallpaper background, saved per browser.
