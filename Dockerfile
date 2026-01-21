# Step 1: Build the production react app
# FROM --platform=linux/amd64 node:22-alpine AS builder
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force && \
    npm ci --no-audit --no-fund --prefer-offline || \
    (npm cache clean --force && npm install --no-audit --no-fund)

COPY . .
RUN npm run build

# Step 2: Build the webserver
# FROM --platform=linux/amd64 nginx:1.28.0-alpine
FROM nginx:1.28.0-alpine

# Copy the built React app
COPY --from=builder /app/dist /usr/share/nginx/html

# Create the entrypoint script INSIDE the container to ensure correct architecture
COPY entrypoint.sh /lmw-entrypoint.sh

# RUN apk add --no-cache dos2unix && \
#     dos2unix /lmw-entrypoint.sh && \
#     chmod +x /lmw-entrypoint.sh && \
#     apk del dos2unix
RUN chmod +x /lmw-entrypoint.sh

EXPOSE 5052

ENTRYPOINT ["/lmw-entrypoint.sh"]