<div align="center">

# 🎧 Echo Beat

### A Full-Stack Audio Streaming Platform with an AI Music Agent

<p><i>Type-safe. Relational. Multi-service. AI-native.</i></p>

<p>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Express_5-404D59?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/github/stars/TheShivaji/EchoBeat?style=flat-square&color=gold" />
  <img src="https://img.shields.io/github/last-commit/TheShivaji/EchoBeat?style=flat-square&color=blue" />
  <img src="https://img.shields.io/github/repo-size/TheShivaji/EchoBeat?style=flat-square&color=orange" />
  <img src="https://img.shields.io/badge/license-ISC-green?style=flat-square" />
</p>

<br/>

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="45" title="React" />&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="45" title="TypeScript" />&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" width="45" title="Node.js" />&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" width="45" title="Express" />&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" width="45" title="Python" />&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" width="45" title="PostgreSQL" />&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg" width="45" title="Redis" />&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg" width="45" title="Docker" />

<br/><br/>

[Features](#-core-features) • [AI Agent](#-ai-music-agent) • [Architecture](#️-architecture-overview) • [Tech Stack](#-tech-stack) • [Setup](#-installation--setup) • [Engineering Notes](#-engineering-highlights--decisions)

</div>

---

## 📖 Overview

**Echo Beat** is a full-stack, production-shaped audio streaming platform split into three independently deployable services — a **React frontend**, a **type-safe Node/Express API**, and a **Python AI microservice** — all orchestrated with **Docker Compose**.

Beyond the standard streaming-app fundamentals (auth, playlists, uploads, search), Echo Beat ships a genuine **AI music agent**: natural-language recommendations, an AI playlist generator, a lyrics translator/explainer with hallucination guardrails, and a conversational assistant with markdown-aware chat and its own context-aware tools.

---

## ⚡ Core Features

<table>
<tr>
<td width="50%" valign="top">

### 🔐 Full Auth Stack
JWT (HTTP-only cookies) + Bcrypt, plus **Google OAuth** via Passport — session and token-based flows both supported.

### 🗄️ Relational Data Mastery
Many-to-Many & One-to-Many schemas via Prisma — albums with multiple artists, liked songs, playlists, play history.

### 🔎 Full Search & Discovery
Dedicated search service across songs, artists, albums, and playlists, plus paginated home feeds, carousels, and "new releases."

</td>
<td width="50%" valign="top">

### ☁️ Media Pipeline
Multer-based uploads with audio metadata extraction, routed to ImageKit/Cloudinary for CDN-backed storage.

### 🎵 Playlist & Library Ecosystem
Full CRUD for playlists, liked songs, curated albums, recently-played history with pagination.

### 🛡️ Production Hardening
Helmet, dual-layer rate limiting (in-memory + **Redis-backed**), structured logging via **Pino**, and centralized error handling.

</td>
</tr>
</table>

---

## 🤖 AI Music Agent

Echo Beat's AI layer runs as its **own FastAPI microservice**, orchestrated with LangChain and Google's Gemini models, and is called by the backend over an internal HTTP boundary (not bolted onto the main API).

| Capability | What it does |
|---|---|
| **Natural-language recommendations** | `/ai/understand` — turns a free-text mood/request into structured music queries against the catalog |
| **AI Playlist Generator** | `/ai/playlist` — builds a playlist from a natural-language prompt, resolved against real artist/album relations |
| **Lyrics Translator & Explainer** | `/ai/lyrics` — translates and explains lyrics with **zero-hallucination guardrails** and an image fallback path |
| **Echo Agent (chatbot)** | `/ai/assistant` — a context-aware conversational agent with music-specific tools and **Markdown-rendered** chat on the frontend |

The backend exposes a `query-router.service.ts` that decides how a request should be routed between the catalog and the AI service, keeping the AI microservice stateless and swappable.

---

## 🏗️ Architecture Overview

```
┌───────────────────┐      REST/JWT      ┌──────────────────────┐      HTTP       ┌────────────────────┐
│      FRONTEND      │ ◄───────────────► │       BACKEND         │ ◄─────────────► │     AI-SERVICE      │
│  React 19 + Vite    │                   │  Express 5 (Node.js)  │                 │  FastAPI (Python)   │
│  Redux Toolkit       │                  │  Prisma ORM            │                │  LangChain + Gemini  │
│  Tailwind CSS v4      │                 │  Passport (JWT+OAuth)   │               └────────────────────┘
│  react-markdown        │                │  Pino logging            │
└───────────────────┘                     │  Helmet + rate-limit      │
                                            └──────────┬───────────┘
                                                       │
                                      ┌────────────────┼────────────────┐
                                      ▼                                 ▼
                              ┌──────────────┐                 ┌───────────────┐
                              │  PostgreSQL   │                 │     Redis      │
                              │ (via Prisma)  │                 │ (rate-limit +  │
                              └──────────────┘                 │   caching)     │
                                                                └───────────────┘
```

All three services, plus Postgres and Redis, are wired together in a single `docker-compose.yml` — `docker compose up` brings up the entire stack.

**Backend** — RESTful API on Express 5, Prisma over PostgreSQL for type-safe queries, JWT + Google OAuth auth, a media pipeline (Multer → ImageKit/Cloudinary) with audio-metadata parsing, dual rate limiting (local + Redis-backed via `rate-limit-redis`), and structured request logging via `pino-http`.

**AI-service** — an isolated FastAPI app so the AI stack (LangChain, Gemini) can be developed, scaled, and rate-limited independently of the core API.

**Frontend** — React 19 + Vite SPA, Redux Toolkit for player/auth/queue state, Tailwind CSS v4, Framer Motion for UI motion, and `react-markdown` to render the AI assistant's replies.

---

## 💻 Tech Stack

<table>
<tr>
<th align="left">🎨 Frontend</th>
<th align="left">⚙️ Backend</th>
<th align="left">🤖 AI Service</th>
</tr>
<tr>
<td valign="top">

- React 19
- Vite 8
- Tailwind CSS v4
- Redux Toolkit
- React Router DOM v6
- Framer Motion
- react-markdown
- Axios
- TypeScript

</td>
<td valign="top">

- Node.js + Express 5
- Prisma ORM
- PostgreSQL
- Redis
- Passport (JWT + Google OAuth)
- Helmet + express-rate-limit
- Pino / pino-http
- ImageKit + Cloudinary
- Multer + music-metadata
- TypeScript

</td>
<td valign="top">

- Python 3.12
- FastAPI + Uvicorn
- LangChain
- langchain-google-genai (Gemini)
- Pydantic
- uv (dependency management)

</td>
</tr>
</table>

---

## 📂 Folder Structure

```
EchoBeat/
├── Backend/
│   ├── prisma/                 # Database schema & migrations
│   ├── src/
│   │   ├── config/              # DB, Redis, Passport, env config
│   │   ├── controllers/         # album, artist, auth, history, home, playlist, search, song, ai
│   │   ├── middleware/          # Auth guards
│   │   ├── routes/               # Express endpoint definitions (mirrors controllers)
│   │   ├── service/               # ai.service, home.service, query-router.service, user.service
│   │   └── utils/                  # Logger, AppError, async handler, audio metadata, Multer
│   └── Dockerfile
├── Frontend/
│   ├── src/
│   │   ├── app/                    # Store & app-level setup
│   │   ├── feature/                # ai, album, artists, auth, home, players, playlist, search, song, upload
│   │   └── components/shared/      # Shared UI
│   └── Dockerfile
├── ai-service/
│   ├── src/
│   │   ├── main.py                 # /ai/understand, /ai/playlist, /ai/lyrics, /ai/assistant
│   │   ├── schemas/                 # assistant, lyrics, recommendation
│   │   └── services/                # llm_service, prompt
│   └── Dockerfile
└── docker-compose.yml               # Frontend + Backend + AI-service + Postgres + Redis
```

---

## 🧠 Engineering Highlights & Decisions

> **Why a separate AI microservice instead of an in-process call?**
> Keeps LangChain/Gemini dependencies, scaling, and rate limits isolated from the core API — the AI service can be redeployed or swapped for a different model provider without touching the Express app.

> **Why PostgreSQL over MongoDB?**
> Music ecosystems are deeply relational (Artists → Songs → Albums → Playlists). A relational DB enforces integrity — `onDelete: Cascade` sweeps orphan records automatically.

> **Dual-layer rate limiting**
> `express-rate-limit` handles per-instance limits; `rate-limit-redis` backs it with a shared store so limits hold correctly across multiple backend replicas.

> **Zero-hallucination guardrails on the lyrics feature**
> The lyrics translator/explainer is constrained to avoid inventing lyrics it isn't confident about, with an image-based fallback when text extraction isn't reliable.

> **Redux Toolkit over Context API**
> A music player needs deeply nested, frequently-updating state — current track, queue, volume, auth — which Context API would re-render poorly.

---

## 🚀 Installation & Setup

### Option A — Docker (recommended)

Brings up Frontend, Backend, AI-service, PostgreSQL, and Redis together.

```bash
git clone https://github.com/TheShivaji/EchoBeat.git
cd EchoBeat
docker compose up --build
```

- Frontend → `http://localhost:5173`
- Backend → `http://localhost:5000`
- AI-service → `http://localhost:8000`

### Option B — Manual setup

**Prerequisites:** Node.js v18+, Python 3.12+ with `uv`, PostgreSQL, Redis, an ImageKit account, and a Google Gemini API key.

**1. Backend**

```bash
cd Backend
npm install
```

Create `Backend/.env`:

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

**2. AI service**

```bash
cd ai-service
uv sync
```

Create `ai-service/.env` with your Gemini/LLM credentials, then:

```bash
uv run uvicorn src.main:app --reload --port 8000
```

**3. Frontend**

```bash
cd Frontend
npm install
npm run dev
```

---

## 📄 License

Licensed under the **ISC License**.

## 👤 Author

<div align="center">

**TheShivaji**

<a href="https://github.com/TheShivaji"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" /></a>
<a href="https://www.linkedin.com/in/shivaji-jagdale-48817330b"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>

*Built feature by feature, service by service.*

</div>
