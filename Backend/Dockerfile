# =========================
# Base Stage
# =========================
FROM node:22-alpine AS base

WORKDIR /app

# =========================
# Dependencies Stage
# =========================
FROM base AS deps

COPY package*.json ./

RUN npm ci

# =========================
# Build Stage
# =========================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src ./src

# Generate Prisma Client and compile TypeScript
RUN npm run build

# Remove devDependencies to keep image small while preserving generated Prisma client
RUN npm prune --omit=dev

# =========================
# Production Stage
# =========================
FROM base AS runtime

ENV NODE_ENV=production
RUN apk add --no-cache curl
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER node

EXPOSE 5000

CMD ["node", "dist/server.js"]