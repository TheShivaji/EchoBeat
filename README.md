<div align="center">
  <h1>🎧 Echo Beat</h1>
  <p><strong>A Modern, Full-Stack Audio Streaming Platform</strong></p>
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
</div>

<br />

## 📖 Project Overview

Echo Beat is a highly scalable, premium web application architected to deliver a seamless audio streaming experience. Built from the ground up using the modern MERN-like stack (replacing MongoDB with a strictly typed PostgreSQL database), it serves as a showcase of senior-level engineering, pristine folder architecture, and performant data delivery.

It avoids the clutter of standard starter kits, offering a beautifully organized, end-to-end type-safe implementation of a complex domain: Music Streaming.

## ⚡ Core Features

- **Robust Authentication:** Secure JWT-based authentication flow with HTTP-only cookies and Bcrypt password hashing.
- **Relational Data Mastery:** Complex Many-to-Many and One-to-Many database relationships handled efficiently via Prisma (e.g., Albums having multiple Artists, Users having Explicit LikedSongs).
- **Media Management:** Direct-to-cloud file uploading leveraging Multer and ImageKit for both audio assets and high-res imagery.
- **Playlist & Library Ecosystem:** Complete CRUD architecture for generating user-specific playlists, liking songs, and curating albums.
- **Race Condition Prevention:** Database-level uniqueness constraints guaranteeing atomic operations on high-traffic endpoints.

---

## 🏗️ Architecture Overview

The application is cleanly decoupled into two main environments:

### Backend 
A RESTful API built on **Express 5** and **Node.js**. 
- **Database:** PostgreSQL accessed exclusively via Prisma ORM for type-safe queries.
- **Security:** Custom authentication middleware verifying secure HttpOnly JWTs.
- **Media Pipeline:** Requests parse multipart form data via Multer and stream buffers directly to ImageKit cloud storage, ensuring the server remains stateless and highly scalable.
- **Error Handling:** Centralized controller try-catch blocks with Prisma constraint error catching (e.g., handling P2002 Race Conditions).

### Frontend
A blazing-fast Single Page Application (SPA).
- **Core:** **React 19** powered by Vite for instant HMR.
- **State Management:** **Redux Toolkit** for predictable, centralized application state.
- **Styling:** **Tailwind CSS v4** providing a highly responsive, utility-first UI layer without bloated stylesheets.
- **Routing:** **React Router DOM v6** for seamless client-side navigation.

---

## 💻 Tech Stack

### 🎨 Frontend
- React 19
- Vite 8
- Tailwind CSS v4
- Redux Toolkit
- Axios
- TypeScript

### ⚙️ Backend
- Node.js
- Express 5
- Prisma ORM
- PostgreSQL
- ImageKit (CDN & Media Storage)
- JSON Web Tokens (JWT)
- BcryptJS
- TypeScript

---

## 📂 Folder Structure

```text
Echo-Beat/
├── Backend/
│   ├── prisma/             # Database schemas & migrations
│   ├── src/
│   │   ├── config/         # Environment & DB configurations
│   │   ├── controllers/    # Route business logic (album, artist, playlist, song)
│   │   ├── middleware/     # JWT Auth guards
│   │   ├── routes/         # Express endpoint definitions
│   │   └── utils/          # ImageKit and Multer configurations
│   └── package.json
└── Frontend/
    ├── src/                # React application roots
    ├── package.json
    └── vite.config.ts
```

---

## 🧠 Engineering Highlights & Decisions

- **Why PostgreSQL over MongoDB?** 
  Music ecosystems are highly relational (Artists → Songs → Albums → Playlists). While MongoDB (MERN) is standard for portfolios, a relational database ensures data integrity. If an artist is deleted, `onDelete: Cascade` instantly sweeps the database clean, preventing orphan records.
- **Explicit Join Tables:** 
  Instead of simple arrays, the `LikedSong` model acts as an explicit Many-to-Many join table, allowing the system to track *when* a user liked a song (`createdAt`), adding depth to the data model.
- **Redux Toolkit over Context API:** 
  Given the complex, deeply nested state required by a music player (current track, play queue, volume, authentication status), Redux Toolkit prevents unnecessary re-renders that the React Context API would trigger.
- **Vite + Tailwind v4:** 
  Prioritizing extreme developer experience (DX) and tiny production bundle sizes.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running locally, or a remote cloud DB string.
- ImageKit Account (for media uploads)

### 1. Clone the repository
```bash
git clone https://github.com/TheShivaji/EchoBeat.git
cd EchoBeat
```

### 2. Backend Setup
```bash
cd Backend
npm install

# Create a .env file and add your credentials:
# DATABASE_URL="postgresql://user:password@localhost:5432/echobeat"
# JWT_SECRET="your_secret_key"
# IMAGEKIT_URL_ENDPOINT="..."
# IMAGEKIT_PUBLIC_KEY="..."
# IMAGEKIT_PRIVATE_KEY="..."

# Push the schema to the database
npx prisma db push
npx prisma generate

# Start the dev server
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd Frontend
npm install

# Start the Vite development server
npm run dev
```

---

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**TheShivaji**
- 💻 GitHub: [@TheShivaji](https://github.com/TheShivaji)

<div align="center">
  <br />
  <i>Built with precision, typed to perfection.</i>
</div>
