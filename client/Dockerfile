# # Use Node.js as the base image
# FROM node:18-alpine

# # Set working directory
# WORKDIR /app

# # Copy package.json and install dependencies
# COPY client/package.json client/package-lock.json ./
# RUN npm install

# # Copy all frontend files
# COPY client/ ./

# # Build React for production
# RUN npm run build

# # Use Nginx to serve the React app
# FROM nginx:alpine
# COPY --from=0 /app/build /usr/share/nginx/html
# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]


# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# # Serve with Nginx
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


# Production stage with nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]