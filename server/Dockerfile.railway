# # Use Node.js as the base image
# FROM node:18-alpine

# # Set working directory
# WORKDIR /app

# # Copy package.json and install dependencies
# COPY server/package.json server/package-lock.json ./
# RUN npm install

# # Copy backend files
# COPY server/ ./

# # Expose port
# EXPOSE 5000

# # Start the server
# CMD ["node", "server.js"]


# Use Node.js as the base image for the server
FROM node:18-alpine

# Set working directory for the server
WORKDIR /app

# Copy package.json and package-lock.json for the server
COPY server/package.json server/package-lock.json ./

# Install server dependencies
RUN npm install

# Copy all backend files
COPY server/ ./

# Expose the port your server runs on (e.g., 5000)
EXPOSE 5000

# Start the Node.js server
CMD ["node", "server.js"]
