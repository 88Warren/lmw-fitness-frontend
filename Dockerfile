# Step 1: Build the production react app
FROM --platform=linux/amd64 node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Step 2: Build the webserver
FROM --platform=linux/amd64 nginx:1.28.0-alpine

# Copy the built React app
COPY --from=builder /app/dist /usr/share/nginx/html

# Create the entrypoint script INSIDE the container to ensure correct architecture
RUN cat > /lmw-entrypoint.sh << 'EOF'
#!/bin/sh
set -e

# --- EXPLICITLY SOURCE THE ENVIRONMENT ---
if [ -f /etc/profile ]; then
  . /etc/profile
fi
if [ -f /etc/environment ]; then
  . /etc/environment
fi
if [ -f /root/.profile ]; then
  . /root/.profile
fi
# --- END ENVIRONMENT SOURCING ---

echo "--- Environment Variables (from printenv) ---"
printenv
echo "--- End Environment Variables ---"

# Ensure the NGINX HTML directory exists
mkdir -p /usr/share/nginx/html

# Generate the env-config.js file
echo "window._env_ = {" > /usr/share/nginx/html/env-config.js

# Loop through environment variables starting with VITE_
for var in $(env | grep "^VITE_" || true); do
  key=$(echo "$var" | cut -d '=' -f 1)
  value=$(echo "$var" | cut -d '=' -f 2-)
  escaped_value=$(echo "$value" | sed 's/"/\\"/g')
  echo "  $key: \"$escaped_value\"," >> /usr/share/nginx/html/env-config.js
done

# Remove the trailing comma from the last line
sed -i '$ s/,$//' /usr/share/nginx/html/env-config.js

echo "};" >> /usr/share/nginx/html/env-config.js

echo "Generated /usr/share/nginx/html/env-config.js:"
cat /usr/share/nginx/html/env-config.js

# Start NGINX
exec nginx -g "daemon off;"
EOF

# Make the script executable
RUN chmod +x /lmw-entrypoint.sh

EXPOSE 5052

ENTRYPOINT ["/lmw-entrypoint.sh"]