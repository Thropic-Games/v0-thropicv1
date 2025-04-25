const fs = require("fs")
const path = require("path")

// Create backup directory
const timestamp = new Date().toISOString().replace(/[:.]/g, "").replace("T", "-").substring(0, 15)
const backupDir = `./backup-unused-files-${timestamp}`

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true })
}

// Files to remove
const filesToRemove = [
  // Debug pages
  "app/debug/page.tsx",
  "app/debug/supabase/page.tsx",
  "app/debug/supabase-client/page.tsx",
  "app/debug/env/page.tsx",
  "app/debug/environment/page.tsx",
  "app/debug/auth-reset/page.tsx",
  "app/debug/cleanup/page.tsx",
  "app/debug/cleanup-firebase/page.tsx",
  "app/debug/donations/page.tsx",
  "app/env-debug/page.tsx",

  // Debug components
  "components/database-debug.tsx",
  "components/donations-debug.tsx",
  "components/env-checker.tsx",

  // Deprecated components
  "lib/firebase.ts",
  "components/auth/auth-form.tsx",
  "components/auth/register-form.tsx",
  "components/auth/register-form-simple.tsx",

  // Duplicate files
  "components/database-donations.tsx",
  "components/cycling-donations.tsx",
  "app/api/check-env/route.ts",

  // Unused utilities
  "hooks/use-debounce.ts",
]

// Function to safely backup and remove a file
function backupAndRemoveFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      // Create directory structure in backup
      const backupPath = path.join(backupDir, filePath)
      const backupDirPath = path.dirname(backupPath)

      if (!fs.existsSync(backupDirPath)) {
        fs.mkdirSync(backupDirPath, { recursive: true })
      }

      // Copy file to backup
      fs.copyFileSync(filePath, backupPath)

      // Remove original file
      fs.unlinkSync(filePath)

      console.log(`✅ Backed up and removed: ${filePath}`)
    } else {
      console.log(`⚠️ File not found: ${filePath}`)
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message)
  }
}

// Process all files
console.log("Starting cleanup of unused files...")
filesToRemove.forEach(backupAndRemoveFile)

// Clean up empty directories
function removeEmptyDirs(dirPath) {
  if (!fs.existsSync(dirPath)) return

  let files = fs.readdirSync(dirPath)

  if (files.length > 0) {
    files.forEach((file) => {
      const fullPath = path.join(dirPath, file)
      if (fs.statSync(fullPath).isDirectory()) {
        removeEmptyDirs(fullPath)
      }
    })

    // Check again after processing subdirectories
    files = fs.readdirSync(dirPath)
  }

  if (files.length === 0) {
    fs.rmdirSync(dirPath)
    console.log(`🗑️ Removed empty directory: ${dirPath}`)
  }
}

// Clean up potentially empty directories
removeEmptyDirs("app/debug")
removeEmptyDirs("app/env-debug")

console.log(`\nCleanup complete! All removed files have been backed up to: ${backupDir}`)
console.log("Please test your application thoroughly after this cleanup.")
