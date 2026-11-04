#!/usr/bin/env bash

set -euo pipefail

LABELS_FILE="${1:-labels.txt}"

if ! command -v gh &> /dev/null; then
  echo "Error: GitHub CLI ('gh') is not installed or not in PATH." >&2
  exit 1
fi

if ! gh auth status &> /dev/null; then
  echo "Error: GitHub CLI is not authenticated. Run 'gh auth login' first." >&2
  exit 1
fi

if [ ! -f "$LABELS_FILE" ]; then
  echo "Error: Labels file '$LABELS_FILE' not found." >&2
  exit 1
fi

echo "Syncing labels from $LABELS_FILE to the current repository..."

while IFS= read -r label || [ -n "$label" ]; do
  # Trim leading/trailing whitespace
  label=$(echo "$label" | xargs)

  # Skip empty lines or commented lines
  if [ -z "$label" ] || [[ "$label" =~ ^# ]]; then
    continue
  fi

  echo "Creating/updating label: $label"
  gh label create "$label" --force
done < "$LABELS_FILE"

echo "Label setup complete."