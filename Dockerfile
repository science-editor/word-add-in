FROM node:18.20.8
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm ci

# copy source & build
COPY . .
RUN npm run build

EXPOSE 7000
COPY server.js .
CMD ["node", "server.js"]

