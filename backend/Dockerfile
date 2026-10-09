FROM node:24-alpine

WORKDIR /app

# Install wget for healthcheck
RUN apk add --no-cache wget

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

# Create uploads directory (mapped to Docker volume)
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

EXPOSE 5000

CMD ["node", "src/server.js"]
