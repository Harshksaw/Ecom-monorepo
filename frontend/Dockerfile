# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build Next.js app
RUN npm run build

# Expose the Next.js port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
