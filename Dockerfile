# Step 1 build the production react app
FROM --platform=linux/amd64 node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Step 2 build the webserver
FROM --platform=linux/amd64 nginx:1.28.0-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

COPY entrypoint.sh /lmw-entrypoint.sh
RUN apk add --no-cache dos2unix
RUN dos2unix /lmw-entrypoint.sh
RUN chmod +x /lmw-entrypoint.sh

EXPOSE 5052
ENTRYPOINT ["/bin/sh", "/lmw-entrypoint.sh"]