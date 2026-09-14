<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,30:203a43,60:2c5364,100:0f0c29&height=200&section=header&text=Echo%20Beat&fontSize=52&fontAlign=50&animation=fadeIn&fontAlignY=40&desc=Full-Stack%20Streaming%20Platform%20%7C%20AI%20Music%20Agent%20%7C%203-Service%20Architecture&descAlign=50&descAlignY=62&fontColor=ffffff&descColor=7dd3fc" />

<br/>

![LangChain](https://img.shields.io/badge/LangChain-Gemini-22c55e?style=for-the-badge)
![Services](https://img.shields.io/badge/Services-3-2c5364?style=flat-square)
![Stack](https://img.shields.io/badge/TypeScript-PostgreSQL-316192?style=flat-square)
![Deploy](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square)
![License](https://img.shields.io/badge/License-ISC-f59e0b?style=flat-square)

> **A relational, type-safe streaming platform with its own FastAPI AI microservice — natural-language recs, AI playlists, a lyrics agent, and a conversational assistant.**

</div>

---

### 😤 The Problem
Most side-project music apps are either:
- A **CRUD demo** with playlists and login, nothing else — or
- An **AI wrapper** bolted onto a single endpoint with no real data model behind it

Neither reflects how a real streaming product is built: relational data at the core, a hardened API in front of it, and AI treated as a **first-class, independently scalable service** — not a side feature.

### ✅ The Solution — Echo Beat
A 3-service system where each concern lives in its own deployable unit:
- A **Prisma/PostgreSQL** data layer that models Artists ↔ Albums ↔ Songs ↔ Playlists as true many-to-many relations, not JSON blobs
- An **Express 5 API** in front of it with JWT + Google OAuth, Helmet, and **Redis-backed dual rate limiting**
- A standalone **FastAPI + LangChain** service that powers recommendations, playlist generation, lyrics translation, and a chat assistant — callable over HTTP, swappable independently of the core API

---

## 🎬 What is this?

Not "add a chatbot to my music app."

Echo Beat's AI layer is its **own Python microservice**, orchestrated separately from the Node backend, and the backend decides *when* to call it via a dedicated `query-router.service.ts`. You get natural-language music discovery, an AI playlist builder, a lyrics translator with hallucination guardrails, and a markdown-rendered conversational agent — all backed by a real relational catalog, not mocked data.

---

## 🧠 AI Service Pipeline

```mermaid
flowchart TD

A[🎤 User Request] --> B{Query Router}

B -->|Free-text mood/request| C[🎯 /ai/understand]
B -->|"Make me a playlist for..."| D[📀 /ai/playlist]
B -->|Lyrics lookup| E[📝 /ai/lyrics]
B -->|Conversational| F[🤖 /ai/assistant]

C --> G[LangChain + Gemini]
D --> G
E --> H[Guardrailed Lyrics Agent]
F --> I[Echo Agent · Context-Aware Tools]

G --> J[Catalog Query — Prisma/PostgreSQL]
H --> K[Image Fallback if text unreliable]
I --> J

J --> L[📤 Structured Response to Frontend]
K --> L
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Full Auth Stack** | JWT (HTTP-only cookies) + Bcrypt, plus Google OAuth via Passport |
| 🗄️ **True Relational Model** | Artists ↔ Songs ↔ Albums ↔ Playlists as many-to-many, not arrays |
| 🎵 **Playlist & Library** | Full CRUD for playlists, liked songs, curated albums |
| ⏱️ **Play History** | Recently-played tracking with pagination and deletion |
| 🔎 **Full Search** | Dedicated search across songs, artists, albums, playlists |
| ☁️ **Media Pipeline** | Multer uploads → ImageKit/Cloudinary, audio metadata extraction |
| 🎯 **AI Recommendations** | Natural-language request → structured catalog query |
| 📀 **AI Playlist Generator** | Prompt → real playlist resolved against artist/album relations |
| 📝 **Lyrics Translator** | Translation + explanation with zero-hallucination guardrails |
| 🤖 **Echo Agent** | Context-aware chat assistant, markdown-rendered replies |
| 🛡️ **Dual Rate Limiting** | In-memory + Redis-backed, holds across replicas |
| 📊 **Structured Logging** | Pino / pino-http request logging |
| 🐳 **One-Command Stack** | Frontend + Backend + AI-service + Postgres + Redis via Compose |

---

## 🛠️ Tech Stack

```
Frontend                 Backend                  AI Service               Data
──────────────           ──────────────           ──────────────           ──────────
React 19                 Node.js                  Python 3.12              PostgreSQL
Redux Toolkit            Express 5                FastAPI + Uvicorn        Prisma ORM
Framer Motion            Passport (JWT+OAuth)     LangChain                Redis
Tailwind CSS v4          Helmet + rate-limit       langchain-google-genai   (rate-limit + cache)
React Router DOM v6      Pino / pino-http          Pydantic
React Markdown           ImageKit + Cloudinary     uv (dependency mgmt)
Axios                    Multer + music-metadata

Deploy
──────────────
Docker Compose
(Frontend + Backend + AI-service + Postgres + Redis, one command)
```

---

## 📁 Project Structure

```
EchoBeat/
├── Backend/
│   ├── Dockerfile
│   ├── prisma/
│   │   └── schema.prisma          ← User, Song, Album, Playlist, Artist, LikedSong, PlayHistory
│   └── src/
│       ├── config/                ← db, redis, passport, env config
│       ├── controllers/           ← album, artist, auth, history, home, playlist, search, song, ai
│       ├── service/
│       │   ├── ai.service.ts
│       │   ├── query-router.service.ts   ← routes requests to catalog vs AI-service
│       │   ├── home.service.ts
│       │   └── user.service.ts
│       ├── middleware/auth.middleware.ts
│       ├── routes/                ← mirrors controllers
│       └── utils/                 ← logger, AppError, audioMetadata, Multer
│
├── ai-service/
│   ├── Dockerfile
│   └── src/
│       ├── main.py                ← /ai/understand, /ai/playlist, /ai/lyrics, /ai/assistant
│       ├── schemas/                ← assistant, lyrics, recommendation
│       └── services/
│           ├── llm_service.py
│           └── prompt.py
│
├── Frontend/
│   ├── Dockerfile
│   └── src/
│       ├── app/                    ← store setup
│       ├── feature/                ← ai, album, artists, auth, home, players, playlist, search, song, upload
│       └── components/shared/
│
└── docker-compose.yml              ← Frontend + Backend + AI-service + Postgres + Redis
```

---

## 🚀 Getting Started

### Option A — Docker (recommended)

```bash
git clone https://github.com/TheShivaji/EchoBeat.git
cd EchoBeat
docker compose up --build
```

```
Frontend    → http://localhost:5173
Backend     → http://localhost:5000
AI-service  → http://localhost:8000
```

### Option B — Manual setup

**Prerequisites:** Node.js v18+, Python 3.12+ with `uv`, PostgreSQL, Redis, an ImageKit account, a Google Gemini API key.

**Backend**

```bash
cd Backend
npm install
```

`Backend/.env`

```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/echobeat"
JWT_SECRET="your_secret_key"
JWT_COOKIE_EXPIRE=15d
REDIS_URL="redis://localhost:6379"
AI_SERVICE_URL="http://localhost:8000"
IMAGEKIT_PUBLIC_KEY="..."
IMAGEKIT_PRIVATE_KEY="..."
IMAGEKIT_URL_ENDPOINT="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

```bash
npx prisma db push
npx prisma generate
npm run dev
```

**AI service**

```bash
cd ai-service
uv sync
# add Gemini/LLM credentials to ai-service/.env
uv run uvicorn src.main:app --reload --port 8000
```

**Frontend**

```bash
cd Frontend
npm install
npm run dev
```

---

## 🔌 API

```
Auth
────────────────────────────────────────
POST    /auth/signup
POST    /auth/login
POST    /auth/logout
GET     /auth/me
PUT     /auth/update-profile
POST    /auth/change-password
GET     /auth/google              ← Google OAuth start
GET     /auth/google/callback

Songs
────────────────────────────────────────
POST    /songs/upload             (admin)
DELETE  /songs/delete/:id         (admin)
GET     /songs/get-all-songs
GET     /songs/new-releases
GET     /songs/get-song-details/:songID
POST    /songs/songs/:songId/like
DELETE  /songs/songs/:songId/like
GET     /songs/liked-songs

Albums · Artists · Playlists
────────────────────────────────────────
POST    /albums/create-album      (admin)
GET     /albums/get-all-albums
GET     /albums/get-album-details/:id
POST    /artists/create-artist    (admin)
GET     /artists/get-all-artists
GET     /artists/artist/:id/songs
POST    /playlists/create
GET     /playlists/my-playlists
POST    /playlists/:playlistId/song

Search · Home · History
────────────────────────────────────────
GET     /search/songs | /artists | /albums | /playlists
GET     /home
POST    /history/play
DELETE  /history/recent

AI (proxied to ai-service)
────────────────────────────────────────
POST    /ai/understand            ← natural-language recommendations
POST    /ai/playlist              ← AI playlist generator
POST    /ai/lyrics                ← lyrics translate + explain
POST    /ai/assistant             ← Echo Agent chat
```

---

## 📌 Roadmap

- [x] Relational schema — Artist / Song / Album / Playlist / LikedSong / PlayHistory
- [x] Auth — JWT (HTTP-only cookies) + Google OAuth
- [x] Full CRUD — songs, albums, artists, playlists
- [x] Search across all catalog entities
- [x] Recently-played history with pagination
- [x] Media pipeline — Multer + ImageKit/Cloudinary + audio metadata
- [x] AI-service split out as its own FastAPI microservice
- [x] Natural-language recommendation endpoint
- [x] AI playlist generator resolved against real relations
- [x] Lyrics translator/explainer with hallucination guardrails
- [x] Echo Agent conversational assistant + markdown chat UI
- [x] Redis-backed dual rate limiting
- [x] Pino structured logging
- [x] Docker Compose — full 5-container stack
- [ ] Webhooks for real-time play events
- [ ] Recommendation caching layer in Redis

---

<div align="center">

**Built by [Shivaji Jagdale](https://github.com/TheShivaji)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shivaji-jagdale-48817330b/)
[![GitHub](https://img.shields.io/badge/GitHub-171515?style=for-the-badge&logo=github&logoColor=white)](https://github.com/TheShivaji)

*⭐ Star this repo if you find it useful*

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:2c5364,100:0f2027&height=100&section=footer" />
