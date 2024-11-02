# Dockerfile for the frontend
FROM node:18-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code and build the application
COPY . .
RUN npm run build

# Create a container only with the built application
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Port on which the frontend will run
EXPOSE 80