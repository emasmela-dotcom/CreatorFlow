#!/bin/bash

# CreatorFlow Bot & Tool Test Runner
# Usage: ./run-tests.sh [token]

echo "🧪 CreatorFlow Test Runner"
echo ""

# Check if token provided
if [ -z "$1" ]; then
  echo "❌ No token provided!"
  echo ""
  echo "Usage:"
  echo "  ./run-tests.sh YOUR_TOKEN_HERE"
  echo ""
  echo "To get a token:"
  echo "  1. Open http://localhost:3000/demo in browser"
  echo "  2. Press F12 → Console tab"
  echo "  3. Run: localStorage.getItem('token')"
  echo "  4. Copy the token and run: ./run-tests.sh YOUR_TOKEN"
  echo ""
  exit 1
fi

# Check if server is running
if ! curl -s http://localhost:3000/api/db/health > /dev/null 2>&1; then
  echo "⚠️  Server doesn't seem to be running on http://localhost:3000"
  echo "   Please start it with: npm run dev"
  echo ""
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Run tests
echo "🚀 Running tests..."
echo ""
TEST_TOKEN="$1" node scripts/test-all-bots-tools.js
