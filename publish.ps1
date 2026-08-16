# Publish the current local Education working copy to the existing GitHub repository.
# Run this script from anywhere inside the local Education repository.

$ErrorActionPreference = "Stop"

$ExpectedRemote = "https://github.com/ronandownes/education.git"
$CommitMessage = "Update education site"

# Always work from the folder containing this script.
$Project = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Project

# Safety checks: this must already be the Education Git repository.
if (-not (Test-Path (Join-Path $Project ".git"))) {
    throw "This folder is not a Git repository. Clone https://github.com/ronandownes/education.git first."
}

$Remote = (git remote get-url origin 2>$null).Trim()
if ($LASTEXITCODE -ne 0 -or -not $Remote) {
    throw "No Git origin remote is configured."
}

$NormalizedRemote = $Remote.TrimEnd('/') -replace '\.git$',''
$NormalizedExpected = $ExpectedRemote.TrimEnd('/') -replace '\.git$',''

if ($NormalizedRemote -ne $NormalizedExpected) {
    throw "Safety stop: origin is '$Remote', not '$ExpectedRemote'. Nothing was pushed."
}

Write-Host "Publishing ronandownes/education..."

# Bring the local branch up to date before publishing.
git pull --ff-only origin main
if ($LASTEXITCODE -ne 0) {
    throw "git pull failed. Nothing was pushed."
}

git add -A

# Commit only when there are staged changes.
git diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
    git commit -m $CommitMessage
    if ($LASTEXITCODE -ne 0) {
        throw "git commit failed."
    }
} else {
    Write-Host "No local changes to commit."
}

git push origin main
if ($LASTEXITCODE -ne 0) {
    throw "git push failed."
}

Write-Host "Published to https://github.com/ronandownes/education"
Write-Host "Live site: https://ronandownes.github.io/education/"
