# Dockerfile for YYC³ Design System

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --legacy-peer-deps --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3200

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3200', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["npm", "run", "preview"]
