# Use Node.js 20 LTS Alpine for a tiny, secure base image
FROM node:20-alpine

# Set environment variable indicating production
ENV NODE_ENV=production

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application using standard Node command (or pm2 if preferred)
CMD ["node", "server.js"]
