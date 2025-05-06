# Step 1: Build the application using Node.js
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the app for production
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Remove default nginx config and add custom one (for React Router support)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
