# ==========================================
# STAGE 1: Dependencies
# ==========================================
FROM node:20-alpine AS deps
# Add libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
# Install ALL dependencies (including dev) for building
RUN npm ci

# ==========================================
# STAGE 2: Builder
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Disable Next.js telemetry to save build time
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# ==========================================
# STAGE 3: Production Runner (The Final Image)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user for security (Standard DevOps Practice)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy ONLY the optimized standalone output and public files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the secure non-root user
USER nextjs

EXPOSE 3000
ENV PORT 3000

# Run the highly optimized standalone server
CMD ["node", "server.js"]