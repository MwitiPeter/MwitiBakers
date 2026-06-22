#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:4000}"

echo "Testing API health at ${API_BASE_URL}..."
if ! curl -fsS "${API_BASE_URL}/" >/dev/null; then
  echo "API root failed"; exit 2
fi

echo "Testing products..."
if ! curl -fsS "${API_BASE_URL}/products" | grep -q 'Rainbow Cake'; then
  echo "Products content unexpected"; exit 3
fi

echo "Smoke tests passed"
