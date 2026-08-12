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
    subgraph Client["🖥️ Frontend — React 19 SPA"]
        UI["React Components"]
        RTK["Redux Toolkit\n(Player / Auth / Queue state)"]
        Router["React Router DOM v6"]
        UI --> RTK
        UI --> Router
    end

    subgraph Server["⚙️ Backend — Express 5 API"]
        Routes["Express Routes"]
        MW["JWT Auth Middleware"]
        Ctrl["Controllers\n(album / artist / playlist / song)"]
        Multer["Multer\n(multipart parsing)"]
        Routes --> MW --> Ctrl
        Ctrl --> Multer
    end

    subgraph Data["🗄️ Data & Media Layer"]
        Prisma["Prisma ORM"]
        PG[("PostgreSQL")]
        IK[("ImageKit CDN")]
        Prisma --> PG
    end

    Client -- "Axios / REST calls" --> Server
    Ctrl -- "type-safe queries" --> Prisma
    Multer -- "stream buffers" --> IK

    style Client fill:#61DAFB33,stroke:#61DAFB
    style Server fill:#40495933,stroke:#404D59
    style Data fill:#31619233,stroke:#316192
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
    SONG ||--o{ LIKEDSONG : "liked as"

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
