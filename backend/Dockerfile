
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files first (this is important for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Then copy the rest of the application
COPY . .

EXPOSE 7000

CMD ["node", "index.js"]
