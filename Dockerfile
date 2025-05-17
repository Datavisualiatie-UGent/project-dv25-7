# Start with a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --quiet

# Copy the source code
COPY . .

RUN apk add --no-cache bash
RUN chmod +x ./dataset/pull.sh
RUN ./dataset/pull.sh

# Expose default Observable port
EXPOSE 3000

# Default command (can be overridden in docker-compose)
CMD ["npm", "run", "dev"]
