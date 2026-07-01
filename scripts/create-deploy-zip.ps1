# Delete previous zip if it exists
if (Test-Path "deploy.zip") {
    Remove-Item "deploy.zip" -Force
}

# Create a temporary staging folder
$stageDir = "deploy_stage"
if (Test-Path $stageDir) {
    Remove-Item $stageDir -Recurse -Force
}
New-Item -ItemType Directory -Path $stageDir | Out-Null

# Copy required directories
$dirs = @(".next", "_next", "app", "src", "public", "lib", "scripts")
foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        if ($dir -eq ".next") {
            # Copy all, then remove compiler caches to save space and time
            Copy-Item -Path $dir -Destination "$stageDir/$dir" -Recurse -Force
            if (Test-Path "$stageDir/.next/cache") {
                Remove-Item "$stageDir/.next/cache" -Recurse -Force
            }
        } else {
            Copy-Item -Path $dir -Destination "$stageDir/$dir" -Recurse -Force
        }
    }
}

# Copy required config files
$files = @("package.json", "package-lock.json", "server.js", "next.config.mjs", "payload.config.ts", "postcss.config.mjs", "tailwind.config.mjs", "tsconfig.json", ".env")
foreach ($file in $files) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination "$stageDir/$file" -Force
    }
}

# Zip the staging folder
Compress-Archive -Path "$stageDir/*" -DestinationPath "deploy.zip" -Force

# Clean up staging folder
Remove-Item $stageDir -Recurse -Force

Write-Host "✅ Created deploy.zip successfully!" -ForegroundColor Green
