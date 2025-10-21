# Step 1: Build the production react app
FROM node:22-alpine@sha256:dbcedd8aeab47fbc0f4dd4bffa55b7c3c729a707875968d467aaaea42d6225af AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Step 2: Build the webserver
FROM nginx:1.28.0-alpine@sha256:30f1c0d78e0ad60901648be663a710bdadf19e4c10ac6782c235200619158284

# Copy the built React app
COPY --from=builder /app/dist /usr/share/nginx/html

# Create the entrypoint script INSIDE the container to ensure correct architecture
RUN cat > /lmw-entrypoint.sh << 'EOF'
#!/bin/sh
set -e

echo "--- Environment Variables ---"
printenv | grep VITE_ || echo "No VITE_ variables found"

mkdir -p /usr/share/nginx/html

echo "window._env_ = {" > /usr/share/nginx/html/env-config.js

for var in $(env | grep "^VITE_" || true); do
  key=$(echo "$var" | cut -d '=' -f 1)
  value=$(echo "$var" | cut -d '=' -f 2-)
  escaped_value=$(echo "$value" | sed 's/"/\\"/g')
  echo "  $key: \"$escaped_value\"," >> /usr/share/nginx/html/env-config.js
done

sed -i '$ s/,$//' /usr/share/nginx/html/env-config.js
echo "};" >> /usr/share/nginx/html/env-config.js

cat /usr/share/nginx/html/env-config.js

exec nginx -g "daemon off;"
EOF

RUN chmod +x /lmw-entrypoint.sh

EXPOSE 5052

ENTRYPOINT ["/lmw-entrypoint.sh"]