import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import config from "./config.js";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

const pool = new Pool({
    connectionString: config.databaseUrl
})

const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter: adapter
})

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}