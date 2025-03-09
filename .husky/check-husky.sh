#!/bin/bash

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null
then
  echo "Error: pnpm is not installed. Please install pnpm to proceed."
  exit 1
fi

# Check if Husky is installed
if [ ! -d "./node_modules/husky" ]; then
  echo "Error: Husky is not installed. Please run 'pnpm install' to install dependencies."
  exit 1
fi

# Check if another package manager is being used
if [ -f "package-lock.json" ]; then
  echo "Error: npm detected (package-lock.json). Please use pnpm instead."
  exit 1
fi

if [ -f "yarn.lock" ]; then
  echo "Error: Yarn detected (yarn.lock). Please use pnpm instead."
  exit 1
fi

if [ -f "bun.lockb" ]; then
  echo "Error: Bun detected (bun.lockb). Please use pnpm instead."
  exit 1
fi

# If all checks pass, continue with the commit
exit 0 