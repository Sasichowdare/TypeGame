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
# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY . .

# Expose the port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
