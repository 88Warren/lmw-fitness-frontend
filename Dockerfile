# Step 1 build the production react app
FROM node:23-alpine3.21 AS builder

ENV GOOS=linux
ENV GOARCH=amd64

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy environment variables
COPY .env.production .env

# Create config.js with environment variables
RUN echo "window._env_ = {" > public/config.js && \
    echo "  VITE_BACKEND_URL: '${VITE_BACKEND_URL}'," >> public/config.js && \
    echo "  VITE_RECAPTCHA_SITE_KEY: '${VITE_RECAPTCHA_SITE_KEY}'" >> public/config.js && \
    echo "};" >> public/config.js

COPY . .
RUN npm run build

# Step 2 build the webserver
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# COPY webserver/default.conf /etc/nginx/nginx.conf
EXPOSE 5052
CMD ["nginx", "-g", "daemon off;"]