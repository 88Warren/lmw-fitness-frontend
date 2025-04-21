# Step 1 build the production react app
FROM node:23-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2 build the webserver
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# COPY webserver/default.conf /etc/nginx/nginx.conf
EXPOSE 5052
CMD ["nginx", "-g", "daemon off;"]