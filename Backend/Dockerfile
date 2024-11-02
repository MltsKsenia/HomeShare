# Dockerfile for the backend
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port that will be used by the container
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
