# 🎧 Echo Beat

**Echo Beat** is a modern, high-performance audio and music streaming web application built on the MERN stack. Designed with scalability and clean developer experience in mind, this project is fully containerized using Docker for effortless setup and deployment.

---

## 🚀 Tech Stack

### Frontend
- **React 19** - Component-based user interface.
- **TypeScript** - Strict typing for clean, robust code.
- **Vite** - Lightning-fast frontend build tool and dev server.

### Backend
- **Node.js (v26)** - High-performance runtime.
- **Express 5** - Minimalist and flexible web application framework.
- **TypeScript** - Typed server-side programming.

### Database & ORM
- **PostgreSQL 17** - Relational database.
- **Prisma 7** - Modern type-safe database client and migrations management.

### DevOps
- **Docker** - Containerized environments.
- **Docker Compose** - Multi-container orchestration.

---

## 🛠️ Getting Started

### Prerequisites
Before starting, ensure you have the following installed on your host machine:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Ensure WSL 2 / Virtualization is enabled)
- [Node.js](https://nodejs.org/) (For local/IDE development, Node v22+ recommended)

---

### 📦 Option A: Start with Docker (Recommended)

To spin up the entire application stack (Frontend, Backend, and PostgreSQL database) in a couple of seconds:

1. Clone the repository and navigate to the project root:
   ```bash
   cd echo-beat
   ```
2. Build and start the containers in detached mode:
   ```bash
   docker compose up -d --build
   ```
3. The services will be available at:
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5000](http://localhost:5000)
   - **Postgres Database:** `localhost:5432`

#### 📋 Helpful Docker Commands
- **Check container status:** `docker compose ps`
- **View live streaming logs:** `docker compose logs -f`
- **Stop containers:** `docker compose down` (Your database data will remain safe in the Docker volume!)

---

### 💻 Option B: Manual Local Startup (Development)

If you prefer to run the services locally on your host machine while using Docker only for the database:

#### 1. Start the Database
Start only the PostgreSQL container in Docker:
```bash
docker compose up -d postgres
```

#### 2. Setup Backend
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install local dependencies:
   ```bash
   npm install
   ```
3. Create a local `.env` file pointing to `localhost`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/echobeat"
   ```
4. Generate the Prisma client and start development server:
   ```bash
   npx prisma generate
   npm run dev
   ```

#### 3. Setup Frontend
1. Navigate to the `Frontend` directory:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```

---

## 🗂️ Project Structure

```text
echo-beat/
├── Backend/
│   ├── prisma/             # Prisma database schema & migrations
│   │   └── schema.prisma
│   ├── src/                # Backend TypeScript source code
│   │   └── index.ts        # Express entry point
│   ├── Dockerfile          # Backend Docker config
│   ├── package.json
│   └── tsconfig.json
├── Frontend/
│   ├── src/                # React components, styles & hooks
│   │   ├── main.tsx        # React entry point
│   │   └── App.tsx         # Main application layouts
│   ├── Dockerfile          # Frontend Docker config
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml      # Orchestration file
└── README.md
```

---

## 🗄️ Database & Prisma Reference (Prisma 7)

Prisma 7 implements a Rust-free TypeScript database adapter pattern. All database configuration URLs are managed in `Backend/prisma.config.ts`. 

- **Create a new migration:**
  ```bash
  npx prisma migrate dev --name <migration_name>
  ```
- **Sync database schema manually:**
  ```bash
  npx prisma db push
  ```
- **Open Prisma Studio (DB GUI):**
  ```bash
  npx prisma studio
  ```

---

## 📄 License
This project is licensed under the ISC License.
