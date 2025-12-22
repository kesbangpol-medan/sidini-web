# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --force

# Copy source code and environment files
COPY . .
COPY .env.production .env.production

# Build application
# ENV NEXT_TELEMETRY_DISABLED=1
# ENV NODE_ENV=production
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install production dependencies
COPY package.json ./
RUN npm install --omit=dev --force

# Copy build artifacts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env.production ./

EXPOSE 3000

CMD ["npm", "start", "--", "-p", "3000"]