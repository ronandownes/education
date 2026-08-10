# Run this from the folder that contains the extracted 'educator' folder.
# Change only $GitHubUser if needed.

$GitHubUser = "ronandownes"
$Repo = "educator"
$Project = Join-Path (Get-Location) "educator"

Set-Location $Project

git init
git branch -M main
git add .
git commit -m "Initial educator manifesto site"

# Create the GitHub repository and push it.
# Requires GitHub CLI (`gh`) and an authenticated account.
gh repo create "$GitHubUser/$Repo" --public --source=. --remote=origin --push

Write-Host ""
Write-Host "Pushed to GitHub."
Write-Host "Now enable GitHub Pages manually:"
Write-Host "Settings -> Pages -> Deploy from a branch -> main -> /(root) -> Save"
