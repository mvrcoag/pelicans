# Pelicans

## Overview
This repo contains a small full-stack app with a frontend slideshow and a backend API that serves random pelican images.

## Requirements
- Node.js 18+
- npm

## Setup
Install dependencies for each project:

```bash
cd frontend
npm install
```

```bash
cd backend
npm install
```

## Environment Variables
Backend (`backend/.env`):
- `UNSPLASH_ACCESS_KEY` (required)
- `PORT` (optional, defaults to `3200`)

Frontend (`frontend/.env`):
- `VITE_API_URL` (required, e.g. `http://localhost:3200`)

## Run
Start each project in its own terminal:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## Default Ports
- Backend: `http://localhost:3200`
- Frontend (Vite): `http://localhost:5173`

## Project Structure
```
pelicans/
  frontend/   # React app (slideshow UI)
  backend/    # API server (random image endpoint)
```
