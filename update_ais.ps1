# Scan students/*.js and update student_list.js
$ErrorActionPreference = "Stop"

$dir = "students"
if (-not (Test-Path $dir)) {
    Write-Error "Directory students not found"
    exit 1
}

# Get filenames
$files = Get-ChildItem -Path $dir -Filter *.js | Select-Object -ExpandProperty Name
if ($null -eq $files) { $files = @() }

# Create content
$content = @()
$content += "// Auto-generated file. Do not edit manually."
$content += "const studentFiles = ["
foreach ($f in $files) {
    $content += "  '$f',"
}
$content += "];"

# Save to file
$content | Set-Content -Path "student_list.js" -Encoding utf8

Write-Host "Success: Updated student_list.js with $($files.Count) files."
