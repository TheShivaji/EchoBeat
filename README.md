<div align="center">

# 🎧 Echo Beat

### A Modern, Full-Stack Audio Streaming Platform

<p><i>Type-safe. Relational. Built for scale.</i></p>

<p>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Express_5-404D59?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
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
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" width="45" title="PostgreSQL" />&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" width="45" title="Tailwind" />

<br/><br/>

[Features](#-core-features) • [Architecture](#️-architecture-overview) • [Tech Stack](#-tech-stack) • [Setup](#-installation--setup) • [Engineering Notes](#-engineering-highlights--decisions)

</div>

---

## 📖 Overview

**Echo Beat** is a highly scalable, premium web application architected to deliver a seamless audio streaming experience. Built from the ground up on a modern MERN-inspired stack — swapping MongoDB for a **strictly typed PostgreSQL** layer — it's a showcase of senior-level engineering, clean folder architecture, and performant data delivery.

No starter-kit clutter. Just a beautifully organized, end-to-end **type-safe** implementation of a genuinely complex domain: music streaming.

---

## ⚡ Core Features

<table>
<tr>
<td width="50%" valign="top">

### 🔐 Robust Authentication
Secure JWT-based auth flow with HTTP-only cookies and Bcrypt password hashing.

### 🗄️ Relational Data Mastery
Complex Many-to-Many & One-to-Many relationships via Prisma — albums with multiple artists, users with liked songs, and more.

</td>
<td width="50%" valign="top">

### ☁️ Media Management
Direct-to-cloud uploads via Multer + ImageKit for audio assets and high-res artwork.

### 🎵 Playlist & Library Ecosystem
Full CRUD for user playlists, liked songs, and curated albums.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### ⚙️ Race Condition Prevention
Database-level uniqueness constraints for atomic operations on high-traffic endpoints.

</td>
<td width="50%" valign="top">

### 🚀 Blazing Fast SPA
Vite-powered React 19 frontend with instant HMR and a tiny production bundle.

</td>
</tr>
</table>

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│           FRONTEND          │        │            BACKEND           │
│                             │        │                              │
│   React 19 + Vite           │  REST  │   Express 5 (Node.js)        │
│   Redux Toolkit (state)     │◄──────►│   Prisma ORM (type-safe)     │
│   Tailwind CSS v4           │  JWT   │   PostgreSQL                 │
│   React Router DOM v6       │        │   Multer → ImageKit (CDN)    │
└─────────────────────────────┘        └──────────────────────────────┘
```

**Backend** — a RESTful API on Express 5 & Node.js, with PostgreSQL accessed exclusively through Prisma for type-safe queries, custom JWT auth middleware, a stateless media pipeline streaming straight to ImageKit, and centralized error handling (including Prisma `P2002` race-condition catches).

**Frontend** — a single-page app powered by React 19 + Vite for instant HMR, Redux Toolkit for predictable state, Tailwind CSS v4 for a utility-first UI, and React Router DOM v6 for client-side navigation.

---

## 💻 Tech Stack

<table>
<tr>
<th align="left">🎨 Frontend</th>
<th align="left">⚙️ Backend</th>
</tr>
<tr>
<td valign="top">

- React 19
- Vite 8
- Tailwind CSS v4
- Redux Toolkit
- Axios
- TypeScript

</td>
<td valign="top">

- Node.js
- Express 5
- Prisma ORM
- PostgreSQL
- ImageKit (CDN & storage)
- JWT + BcryptJS
- TypeScript

</td>
</tr>
</table>

---

## 📂 Folder Structure

```
Echo-Beat/
├── Backend/
│   ├── prisma/             # Database schemas & migrations
│   ├── src/
│   │   ├── config/         # Environment & DB configurations
│   │   ├── controllers/    # Route business logic (album, artist, playlist, song)
│   │   ├── middleware/     # JWT auth guards
│   │   ├── routes/         # Express endpoint definitions
│   │   └── utils/          # ImageKit and Multer configurations
│   └── package.json
└── Frontend/
    ├── src/                # React application root
    ├── package.json
    └── vite.config.ts
```

---

## 🧠 Engineering Highlights & Decisions

> **Why PostgreSQL over MongoDB?**
> Music ecosystems are deeply relational (Artists → Songs → Albums → Playlists). A relational DB enforces data integrity — `onDelete: Cascade` instantly sweeps orphan records when an artist is deleted.

> **Explicit Join Tables**
> `LikedSong` is an explicit Many-to-Many join table (not a simple array), so the system can track *when* a user liked a song via `createdAt`.

> **Redux Toolkit over Context API**
> A music player needs deeply nested state — current track, play queue, volume, auth status. Redux Toolkit avoids the re-render storms Context API would trigger here.

> **Vite + Tailwind v4**
> Prioritizing developer experience and tiny production bundle sizes.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- PostgreSQL (local or cloud connection string)
- An ImageKit account (for media uploads)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/TheShivaji/EchoBeat.git
cd EchoBeat
```

### 2️⃣ Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/echobeat"
JWT_SECRET="your_secret_key"
IMAGEKIT_URL_ENDPOINT="..."
IMAGEKIT_PUBLIC_KEY="..."
IMAGEKIT_PRIVATE_KEY="..."
```

```bash
npx prisma db push
npx prisma generate
npm run dev
```

### 3️⃣ Frontend setup

In a new terminal:

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

*Built with precision, typed to perfection.*

</div>
