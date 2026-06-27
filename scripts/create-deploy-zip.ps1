# create-deploy-zip.ps1
# Creates a deployment ZIP for Hostinger (includes .next build, excludes dev files)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ZipPath = Join-Path $ProjectRoot "deploy.zip"

Write-Host "Creating deployment ZIP at: $ZipPath" -ForegroundColor Cyan

# Remove old ZIP if it exists
if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
    Write-Host "Removed old deploy.zip" -ForegroundColor Yellow
}

# Files and folders to INCLUDE
$includes = @(
    ".next",
    "public",
    "src",
    "app",
    "server.js",
    "package.json",
    ".env"
)

# Create a temp folder with only what we need
$TempDir = Join-Path $env:TEMP "makhlooq-deploy-$(Get-Date -Format 'yyyyMMddHHmmss')"
New-Item -ItemType Directory -Path $TempDir | Out-Null

Write-Host "Copying files to temp directory..." -ForegroundColor Cyan

foreach ($item in $includes) {
    $src = Join-Path $ProjectRoot $item
    $dst = Join-Path $TempDir $item

    if (Test-Path $src -PathType Container) {
        # It's a directory - copy recursively, skipping node_modules inside
        Copy-Item -Path $src -Destination $dst -Recurse -Force -Exclude "node_modules"
        Write-Host "  Copied folder: $item" -ForegroundColor Green
    } elseif (Test-Path $src -PathType Leaf) {
        # It's a file
        $dstDir = Split-Path $dst -Parent
        if (-not (Test-Path $dstDir)) { New-Item -ItemType Directory -Path $dstDir | Out-Null }
        Copy-Item -Path $src -Destination $dst -Force
        Write-Host "  Copied file:   $item" -ForegroundColor Green
    } else {
        Write-Host "  Skipped (not found): $item" -ForegroundColor Yellow
    }
}

# Compress
Write-Host "Compressing to deploy.zip..." -ForegroundColor Cyan
Compress-Archive -Path "$TempDir\*" -DestinationPath $ZipPath -Force

# Cleanup temp
Remove-Item $TempDir -Recurse -Force

$ZipSize = [math]::Round((Get-Item $ZipPath).Length / 1MB, 1)
Write-Host ""
Write-Host "Done! deploy.zip created ($ZipSize MB)" -ForegroundColor Green
Write-Host "Upload this ZIP to Hostinger and extract it into ~/domains/kmhq.org/nodejs/" -ForegroundColor Cyan
Write-Host ""
Write-Host "NOTE: After uploading, run in hPanel > Node.js:" -ForegroundColor Yellow
Write-Host "  npm install --omit=dev" -ForegroundColor White
Write-Host "  Then click Restart" -ForegroundColor White
