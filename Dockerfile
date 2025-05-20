# Step 1 build the production react app
FROM node:23-alpine3.21 AS builder

ENV GOOS=linux
ENV GOARCH=amd64

WORKDIR /app
COPY package*.json ./
RUN npm install

# # Create public directory and placeholder config.js for build time
# RUN mkdir -p public && \
#     echo "// This is a placeholder config file that will be replaced at runtime" > public/config.js

COPY . .
RUN npm run build

# Step 2 build the webserver
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

COPY entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 5052
# CMD ["nginx", "-g", "daemon off;"]
ENTRYPOINT ["/docker-entrypoint.sh"]