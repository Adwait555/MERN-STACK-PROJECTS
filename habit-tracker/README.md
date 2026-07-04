# Habit Tracker (MERN)

Track daily habits and build streaks — simple by design.

## Structure
```
habit-tracker/
  server/   Express + MongoDB API
  client/   React (Vite) frontend
```

## Setup
1. `cd server`, `cp .env.example .env`, fill in `MONGO_URI` and `JWT_SECRET`, then `npm install` and `npm run dev`.
2. `cd client`, `cp .env.example .env`, then `npm install` and `npm run dev`.
3. Open `http://localhost:5173`, register, and add your first habit.

## Features
- JWT auth, private per-user habit lists.
- Tap the icon to check in for today — animated pulse + confetti.
- Server-computed current streak (with 1-day grace) and longest streak.
- 7-day dot history per habit.
- 4 switchable color themes (Amber, Berry, Lagoon, Charcoal) with animated wallpaper.

## Data model
A `Habit` just stores `completedDates: string[]` (e.g. `"2026-07-04"`). Streaks are computed on the fly server-side — no separate log collection needed. This keeps the whole app to 2 models (`User`, `Habit`) and 4 endpoints.
