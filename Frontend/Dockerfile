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
COPY . .
# Build the Vite project (bypassing strict TypeScript checks for now)
RUN npx vite build

# =========================
# Production Stage (Nginx)
# =========================
FROM nginx:alpine AS runtime

# Copy the built files from builder to Nginx's default serving directory
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx default port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
