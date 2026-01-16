#!/bin/bash

# Read commit message from git
COMMIT_MSG_FILE=".git/COMMIT_EDITMSG"

# Check if commit message file exists
if [ ! -f "$COMMIT_MSG_FILE" ]; then
  echo "No commit message file found. Skipping commitlint."
  exit 0
fi

# Run commitlint on the commit message
npx --no-install commitlint --edit "$COMMIT_MSG_FILE"
