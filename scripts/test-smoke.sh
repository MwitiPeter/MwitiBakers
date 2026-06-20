#!/usr/bin/env bash
set -euo pipefail

echo "Testing API health..."
if ! curl -fsS http://localhost:4000/ >/dev/null; then
  echo "API root failed"; exit 2
fi

echo "Testing products..."
if ! curl -fsS http://localhost:4000/products | grep -q 'Rainbow Cake'; then
  echo "Products content unexpected"; exit 3
fi

echo "Smoke tests passed"
