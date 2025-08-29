# Use Node.js LTS
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g ts-node typescript   # <-- install ts-node globally

COPY . .

EXPOSE 8080

# Start the server
CMD ["ts-node", "src/server.js"]
