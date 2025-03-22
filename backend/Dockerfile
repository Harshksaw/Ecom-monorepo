# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
