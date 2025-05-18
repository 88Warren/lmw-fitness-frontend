# Step 1 build the production react app
FROM node:23-alpine3.21 AS builder

ENV GOOS=linux
ENV GOARCH=amd64

WORKDIR /app
COPY package*.json ./
RUN npm install

# Create a placeholder config.js for build time
RUN echo "// This is a placeholder config file that will be replaced at runtime" > public/config.js

COPY . .
RUN npm run build

# Step 2 build the webserver
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# COPY webserver/default.conf /etc/nginx/nginx.conf
EXPOSE 5052
CMD ["nginx", "-g", "daemon off;"]