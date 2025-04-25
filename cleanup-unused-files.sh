#!/bin/bash

echo "Starting cleanup of unused files..."

# Create a backup directory
BACKUP_DIR="./backup-unused-files-$(date +%Y%m%d%H%M%S)"
mkdir -p $BACKUP_DIR

# Function to safely move files to backup
backup_file() {
  if [ -f "$1" ]; then
    echo "Backing up: $1"
    mkdir -p "$(dirname "$BACKUP_DIR/$1")"
    cp "$1" "$BACKUP_DIR/$1"
    rm "$1"
    echo "Removed: $1"
  else
    echo "Warning: File not found - $1"
  fi
}

echo "1. Removing debug and testing files..."
# Debug pages
backup_file "app/debug/page.tsx"
backup_file "app/debug/supabase/page.tsx"
backup_file "app/debug/supabase-client/page.tsx"
backup_file "app/debug/env/page.tsx"
backup_file "app/debug/environment/page.tsx"
backup_file "app/debug/auth-reset/page.tsx"
backup_file "app/debug/cleanup/page.tsx"
backup_file "app/debug/cleanup-firebase/page.tsx"
backup_file "app/debug/donations/page.tsx"
backup_file "app/env-debug/page.tsx"

# Debug components
backup_file "components/database-debug.tsx"
backup_file "components/donations-debug.tsx"
backup_file "components/env-checker.tsx"

echo "2. Removing deprecated or replaced components..."
backup_file "lib/firebase.ts"
backup_file "components/auth/auth-form.tsx"
backup_file "components/auth/register-form.tsx"
backup_file "components/auth/register-form-simple.tsx"

echo "3. Removing duplicate or redundant files..."
backup_file "components/database-donations.tsx"
backup_file "components/cycling-donations.tsx"
backup_file "app/api/check-env/route.ts"

echo "4. Removing unused utility files..."
backup_file "hooks/use-debounce.ts"

echo "5. Cleaning up empty directories..."
find app/debug -type d -empty -delete
find app/env-debug -type d -empty -delete

echo "Cleanup complete! All removed files have been backed up to: $BACKUP_DIR"
echo "Please test your application thoroughly after this cleanup."
