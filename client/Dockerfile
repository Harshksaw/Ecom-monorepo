# Base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy deps and install
COPY package*.json ./
RUN npm install
RUN npm install -D tailwindcss postcss autoprefixer
# Copy rest and build
COPY . .


# Production image
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]