# Step 1 build the production react app
FROM node:23-alpine3.22 AS builder

ENV GOOS=linux
ENV GOARCH=amd64

WORKDIR /app
COPY package*.json ./
RUN npm install

ARG VITE_BACKEND_URL
ARG VITE_RECAPTCHA_SITE_KEY

# Make environment variables available to Vite build process
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY

# Print environment variables for debugging
# RUN echo "VITE_BACKEND_URL: $VITE_BACKEND_URL"
# RUN echo "VITE_RECAPTCHA_SITE_KEY: $VITE_RECAPTCHA_SITE_KEY"

COPY . .
RUN npm run build

# Step 2 build the webserver
ARG CACHE_BREAKER
FROM nginx:1.28.0-alpine3.21
COPY --from=builder /app/dist /usr/share/nginx/html

COPY entrypoint.sh /lmw-entrypoint.sh
RUN chmod +x /lmw-entrypoint.sh

RUN ls -la /lmw-entrypoint.sh
RUN cat /lmw-entrypoint.sh

EXPOSE 5052
ENTRYPOINT ["/lmw-entrypoint.sh"]