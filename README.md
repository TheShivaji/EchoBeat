<div align="center">

# 🎧 Echo Beat

### A Modern, Full-Stack Audio Streaming Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[Overview](#-project-overview) •
[Features](#-core-features) •
[Architecture](#️-architecture) •
[Tech Stack](#-tech-stack) •
[Setup](#-installation--setup) •
[Engineering Notes](#-engineering-highlights--decisions)

</div>

---

## 📖 Project Overview

**Echo Beat** is a highly scalable, premium web application architected to deliver a seamless audio streaming experience. Built on a modern MERN-like stack — with MongoDB replaced by a strictly typed **PostgreSQL** database — it's a showcase of senior-level engineering, clean folder architecture, and performant data delivery.

It skips the clutter of typical starter kits and instead offers a beautifully organized, end-to-end type-safe implementation of a genuinely complex domain: **music streaming**.

---

## ⚡ Core Features

| Feature | Description |
|---|---|
| 🔐 **Robust Authentication** | Secure JWT-based auth flow with HTTP-only cookies + Bcrypt password hashing |
| 🔗 **Relational Data Mastery** | Complex Many-to-Many & One-to-Many relationships via Prisma (Albums ↔ Artists, Users ↔ Liked Songs) |
| ☁️ **Media Management** | Direct-to-cloud uploads using Multer + ImageKit for audio & high-res imagery |
| 🎵 **Playlist & Library Ecosystem** | Full CRUD for user playlists, liked songs, and album curation |
| ⚙️ **Race Condition Prevention** | DB-level uniqueness constraints guaranteeing atomic ops on high-traffic endpoints |

---

## 🏗️ Architecture

The application is cleanly decoupled into two independent environments — a stateless Express API and a Vite-powered React SPA — talking to PostgreSQL and ImageKit.

```mermaid
flowchart LR
    %% =========================
    %% CLIENT
    %% =========================
    subgraph Client["🖥️  FRONTEND  •  React 19 SPA"]
        direction TB

        UI["⚛️ React Components"]
        RTK["🧠 Redux Toolkit<br/>Player • Auth • Queue"]
        Router["🧭 React Router DOM v6"]

        UI --> RTK
        UI --> Router
    end

    %% =========================
    %% SERVER
    %% =========================
    subgraph Server["⚙️  BACKEND  •  Express 5 API"]
        direction TB

        Routes["🛣️ Express Routes"]
        MW["🔐 JWT Auth Middleware"]
        Multer["📦 Multer<br/>Multipart Parsing"]
        Ctrl["🎯 Controllers<br/>Album • Artist • Playlist • Song"]

        Routes --> MW
        MW --> Multer
        Multer --> Ctrl
    end

    %% =========================
    %% DATA
    %% =========================
    subgraph Data["🗄️  DATA & MEDIA"]
        direction TB

        Prisma["🔷 Prisma ORM"]
        PG[("🐘 PostgreSQL")]
        IK[("🖼️ ImageKit CDN")]

        Prisma --> PG
    end

    %% =========================
    %% CONNECTIONS
    %% =========================
    Client -->|"REST API • Axios"| Server
    Ctrl -->|"Type-safe Queries"| Prisma
    Ctrl -->|"Media Uploads"| IK

    %% =========================
    %% STYLES
    %% =========================
    style Client fill:#F0F9FF,stroke:#38BDF8,stroke-width:2px,color:#0F172A
    style Server fill:#F8FAFC,stroke:#64748B,stroke-width:2px,color:#0F172A
    style Data fill:#F5F3FF,stroke:#8B5CF6,stroke-width:2px,color:#0F172A

    style UI fill:#FFFFFF,stroke:#61DAFB,stroke-width:1.5px,color:#0F172A
    style RTK fill:#FFFFFF,stroke:#764ABC,stroke-width:1.5px,color:#0F172A
    style Router fill:#FFFFFF,stroke:#CA4245,stroke-width:1.5px,color:#0F172A

    style Routes fill:#FFFFFF,stroke:#475569,stroke-width:1.5px,color:#0F172A
    style MW fill:#FFFFFF,stroke:#EF4444,stroke-width:1.5px,color:#0F172A
    style Multer fill:#FFFFFF,stroke:#F59E0B,stroke-width:1.5px,color:#0F172A
    style Ctrl fill:#FFFFFF,stroke:#10B981,stroke-width:1.5px,color:#0F172A

    style Prisma fill:#FFFFFF,stroke:#2D3748,stroke-width:1.5px,color:#0F172A
    style PG fill:#FFFFFF,stroke:#336791,stroke-width:1.5px,color:#0F172A
    style IK fill:#FFFFFF,stroke:#2563EB,stroke-width:1.5px,color:#0F172A

    linkStyle default stroke:#64748B,stroke-width:1.5px

```

### Request Lifecycle

```mermaid
sequenceDiagram
    actor U as User
    participant FE as React SPA
    participant API as Express API
    participant Auth as JWT Middleware
    participant DB as PostgreSQL (Prisma)
    participant CDN as ImageKit

    U->>FE: Interacts (play song / like / upload)
    FE->>API: REST request (with HttpOnly JWT cookie)
    API->>Auth: Verify token
    Auth-->>API: Authorized ✅
    API->>DB: Prisma query / mutation
    alt Media upload
        API->>CDN: Stream file buffer
        CDN-->>API: Hosted media URL
    end
    DB-->>API: Result set
    API-->>FE: JSON response
    FE-->>U: Updated UI / playback
```

### Core Data Model

```mermaid
erDiagram
    USER ||--o{ PLAYLIST : creates
    USER ||--o{ LIKEDSONG : likes
    ARTIST ||--o{ ALBUM : releases
    ARTIST }o--o{ SONG : performs
    ALBUM ||--o{ SONG : contains
    PLAYLIST }o--o{ SONG : includes
    SONG ||--o{ LIKEDSONG : liked_as

    USER {
        string id PK
        string email
        string passwordHash
    }

    ARTIST {
        string id PK
        string name
    }

    ALBUM {
        string id PK
        string title
        string artistId FK
    }

    SONG {
        string id PK
        string title
        string audioUrl
        string albumId FK
    }

    PLAYLIST {
        string id PK
        string name
        string userId FK
    }

    LIKEDSONG {
        string userId FK
        string songId FK
        datetime createdAt
    }
```

---

## 💻 Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### 🎨 Frontend
- **React 19** — UI library
- **Vite 8** — build tool, instant HMR
- **Tailwind CSS v4** — utility-first styling
- **Redux Toolkit** — centralized state management
- **React Router DOM v6** — client-side routing
- **Axios** — HTTP client
- **TypeScript** — end-to-end type safety

</td>
<td valign="top" width="50%">

### ⚙️ Backend
- **Node.js** + **Express 5** — REST API
- **Prisma ORM** — type-safe database access
- **PostgreSQL** — relational database
- **ImageKit** — CDN & media storage
- **JSON Web Tokens (JWT)** — auth
- **BcryptJS** — password hashing
- **TypeScript** — end-to-end type safety

</td>
</tr>
</table>

---

## 📂 Folder Structure

```text
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

- **Why PostgreSQL over MongoDB?** Music ecosystems are inherently relational (Artists → Songs → Albums → Playlists). A relational database enforces data integrity — `onDelete: Cascade` instantly sweeps dependent records clean when an artist is deleted, preventing orphaned data.
- **Explicit Join Tables:** Instead of plain arrays, the `LikedSong` model is an explicit Many-to-Many join table, so the system can track *when* a user liked a song (`createdAt`), adding real depth to the data model.
- **Redux Toolkit over Context API:** A music player carries deeply nested state (current track, play queue, volume, auth status). Redux Toolkit avoids the unnecessary re-renders that Context API would trigger here.
- **Vite + Tailwind v4:** Prioritizes developer experience and small production bundle sizes.
- **Stateless Media Pipeline:** Uploaded files are parsed via Multer and streamed directly to ImageKit — the server never holds media on disk, keeping it horizontally scalable.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed locally, or a remote cloud DB connection string
- An ImageKit account (for media uploads)

### 1. Clone the repository

```bash
git clone https://github.com/TheShivaji/EchoBeat.git
cd EchoBeat
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/echobeat"
JWT_SECRET="your_secret_key"
IMAGEKIT_URL_ENDPOINT="..."
IMAGEKIT_PUBLIC_KEY="..."
IMAGEKIT_PRIVATE_KEY="..."
```

Push the schema and start the dev server:

```bash
npx prisma db push
npx prisma generate
npm run dev
```

### 3. Frontend setup

Open a new terminal window:

```bash
cd Frontend
npm install
npm run dev
```

---

## 🗺️ Roadmap

- [ ] Real-time collaborative playlists
- [ ] Audio waveform visualizer
- [ ] Recommendation engine based on listening history
- [ ] Dockerized one-command local setup

---

## 📄 License

This project is licensed under the **ISC License**.

## 👤 Author

**TheShivaji**

- 💻 GitHub: [@TheShivaji](https://github.com/TheShivaji)

<div align="center">

*Built with precision, typed to perfection.* 🎧

</div>
