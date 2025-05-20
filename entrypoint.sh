#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status

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
# This sed command targets the last line ($) and substitutes a comma (,) with nothing
# if it's at the end of the line.
sed -i '$s/,$//' /usr/share/nginx/html/env-config.js

echo "};" >> /usr/share/nginx/html/env-config.js

echo "Generated /usr/share/nginx/html/env-config.js:"
cat /usr/share/nginx/html/env-config.js

# Start NGINX
exec nginx -g "daemon off;"