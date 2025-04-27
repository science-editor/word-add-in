# Use the specific Node.js image as a base
FROM node:18.20.8

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm ci

# Copy the rest of the app source code
COPY . .

# Expose the desired port (7000)
EXPOSE 7000

# Start the Express app
RUN npm run build
CMD ["npx", "serve", "-s", "dist", "-l", "7000"]
