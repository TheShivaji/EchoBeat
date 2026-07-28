import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Echo Beat Backend is running!");
});

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "OK", database: "Connected" });
  } catch (error) {
    res.status(500).json({ status: "Error", error: String(error) });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
