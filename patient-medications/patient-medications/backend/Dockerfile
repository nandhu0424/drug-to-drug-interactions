FROM node:18-alpine

WORKDIR /app

# Copy package descriptors first to cache dependencies
COPY package*.json ./

RUN npm install --production

# Copy application files
COPY . .

EXPOSE 5000

ENV PORT=5000

CMD ["node", "server.js"]

