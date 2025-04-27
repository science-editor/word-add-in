# Use the specific Node.js image as a base
FROM node:18.20.8

# Install 'serve' globally
RUN npm install -g serve

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm ci

# Copy the rest of the app source code
COPY . .

# Build the production files (very important)
RUN npm run build

# Expose the desired port (7000)
EXPOSE 7000

# Start the static file server
CMD ["serve", "dist", "-l", "7000"]




