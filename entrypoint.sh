#!/bin/sh
set -e

# --- EXPLICITLY SOURCE THE ENVIRONMENT ---
if [ -f /etc/profile ]; then
  source /etc/profile
fi
if [ -f /etc/environment ]; then
  source /etc/environment
fi
if [ -f /root/.profile ]; then
  source /root/.profile
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
# and add them to window._env_
# Using 'env' command to get current environment variables
# We need to escape any double quotes within the variable values
for var in $(env | grep "^VITE_"); do
  # Extract key and value
  key=$(echo "$var" | cut -d '=' -f 1)
  value=$(echo "$var" | cut -d '=' -f 2-) # Get everything after the first '='

  # Escape double quotes within the value for JSON string safety
  escaped_value=$(echo "$value" | sed 's/"/\\"/g')

  echo "  $key: \"$escaped_value\"," >> /usr/share/nginx/html/env-config.js
done

# Remove the trailing comma from the last line (if any variables were added)
sed -i '$s/,$//' /usr/share/nginx/html/env-config.js

echo "};" >> /usr/share/nginx/html/env-config.js

echo "Generated /usr/share/nginx/html/env-config.js:"
cat /usr/share/nginx/html/env-config.js

# Start NGINX
exec nginx -g "daemon off;"