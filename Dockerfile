# Use an official Node.js runtime as the base image
FROM node:16-alpine3.16 AS builder

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy the frontend application files
COPY package*.json ./
COPY . .

# Install dependencies and build the frontend
RUN npm install
RUN npm run build

# Use a minimal Nginx image for serving the build
FROM nginx:alpine

# Copy the built frontend from the builder stage to Nginx
COPY --from=builder /app/frontend/build /usr/share/nginx/html

# Expose the port for Nginx
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
