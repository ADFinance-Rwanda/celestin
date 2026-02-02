# 1. Base image
FROM node:22-alpine AS base
# Prisma requires openssl and libc6-compat to run on Alpine
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

# 2. Dependencies stage
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# 3. Builder stage
FROM deps AS builder
COPY . .
# Generate Prisma Client
RUN npx prisma generate
# Build TypeScript application
RUN npm run build

# 4. Production stage
FROM base AS prod
WORKDIR /app
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
# Copy the generated Prisma client from the custom output directory
# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001 -G nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Start the application using the start script defined in package.json
CMD ["npm", "run", "start"]