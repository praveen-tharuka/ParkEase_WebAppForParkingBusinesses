<#
Setup script for Windows to install Docker Desktop (via winget if available),
start the backend containers, wait for Postgres, and push the Prisma schema.

Usage (run as Administrator in PowerShell):
  powershell -ExecutionPolicy Bypass -File .\setup-docker-and-db.ps1

Notes:
- This script attempts a best-effort install with `winget`. If `winget` is not
  available or the install requires manual steps, follow manual Docker Desktop
  installation instructions: https://www.docker.com/products/docker-desktop
- Reboots or extra prompts may be required when enabling WSL2.
#>

function Ensure-Admin {
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if (-not $isAdmin) {
        Write-Error "This script must be run as Administrator. Open an elevated PowerShell and re-run."
        exit 1
    }
}

function Exec($cmd) {
    Write-Host "$ $cmd"
    $proc = Start-Process -FilePath "powershell" -ArgumentList "-NoProfile -Command $cmd" -NoNewWindow -PassThru -Wait
    return $proc.ExitCode
}

Ensure-Admin

Write-Host "Checking for Docker..."
try {
    docker --version | Out-Null
    $dockerPresent = $true
} catch {
    $dockerPresent = $false
}

if (-not $dockerPresent) {
    Write-Host "Docker not found. Will try to install Docker Desktop using winget."
    try {
        winget --version | Out-Null
        $haveWinget = $true
    } catch {
        $haveWinget = $false
    }

    if ($haveWinget) {
        Write-Host "Installing Docker Desktop via winget (this may prompt and take several minutes)..."
        $code = Exec "winget install --silent --accept-source-agreements --accept-package-agreements --id Docker.DockerDesktop -e"
        if ($code -ne 0) {
            Write-Warning "winget install returned exit code $code. You may need to install Docker Desktop manually."
        }
    } else {
        Write-Warning "winget not available. Please download and install Docker Desktop manually: https://www.docker.com/products/docker-desktop"
    }

    # Try to start Docker Desktop process (if installed in default path)
    $possiblePaths = @("C:\Program Files\Docker\Docker\Docker Desktop.exe", "C:\Program Files\Docker\Docker\Docker Desktop\Docker Desktop.exe")
    foreach ($p in $possiblePaths) {
        if (Test-Path $p) {
            Write-Host "Starting Docker Desktop from $p"
            Start-Process -FilePath $p -WindowStyle Minimized
            break
        }
    }

    Write-Host "Waiting up to 3 minutes for Docker to become available..."
    $max = 180
    $count = 0
    while ($count -lt $max) {
        Start-Sleep -Seconds 3
        try { docker info > $null 2>&1; $ok = $LASTEXITCODE -eq 0 } catch { $ok = $false }
        if ($ok) { break }
        $count += 3
    }

    if (-not $ok) {
        Write-Error "Docker did not become available within the timeout. Please ensure Docker Desktop is running and try again."
        exit 1
    }
}

Write-Host "Docker is available. Proceeding to start containers."

Push-Location -Path (Split-Path -Path $MyInvocation.MyCommand.Path -Parent)

if (-not (Test-Path .env)) {
    if (Test-Path .env.example) {
        Copy-Item .env.example .env -Force
        Write-Host "Copied .env.example to .env"
    } else {
        Write-Warning "No .env.example found. Please create backend\.env with DATABASE_URL before running prisma db push."
    }
}

Write-Host "Running docker compose up -d"
$code = Exec "docker compose up -d"
if ($code -ne 0) {
    Write-Error "docker compose up failed with exit code $code"
    Pop-Location
    exit 1
}

Write-Host "Waiting for Postgres on localhost:5432 to become available (timeout 120s)..."
$timeout = 120
$elapsed = 0
while ($elapsed -lt $timeout) {
    $res = Test-NetConnection -ComputerName '127.0.0.1' -Port 5432 -WarningAction SilentlyContinue
    if ($res.TcpTestSucceeded) { break }
    Start-Sleep -Seconds 2
    $elapsed += 2
}

if ($elapsed -ge $timeout) {
    Write-Warning "Postgres did not appear to be listening on localhost:5432 after $timeout seconds. Ensure the container is healthy and ports are mapped correctly."
    docker compose ps
    Pop-Location
    exit 1
}

Write-Host "Postgres appears reachable. Running prisma db push..."

# Ensure Node modules are present
if (-not (Test-Path node_modules)) {
    Write-Host "Installing Node dependencies (npm install)..."
    $code = Exec "npm install"
    if ($code -ne 0) { Write-Warning "npm install returned $code; continuing anyway." }
}

$code = Exec "npx prisma db push"
if ($code -ne 0) {
    Write-Error "prisma db push failed with exit code $code"
    Pop-Location
    exit 1
}

Write-Host "Prisma schema pushed to database successfully."
docker compose ps

Pop-Location

Write-Host "Setup complete."
