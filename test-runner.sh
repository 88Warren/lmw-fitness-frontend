#!/bin/sh

# Frontend test runner for CI/CD pipeline
set -e

echo "🧪 Running frontend unit tests..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci
fi

# Run unit tests
echo "🚀 Executing tests..."
npm run test-unit

echo "✅ Frontend tests completed successfully!"