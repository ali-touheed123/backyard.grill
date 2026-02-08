
$mappingPath = "image-mapping-utf8.json"
$mockDataPath = "src\data\mockData.ts"

$content = Get-Content -Path $mappingPath -Raw
# Extract JSON between markers
if ($content -match "--- MAPPING START ---\s*(\{[\s\S]*?\})\s*--- MAPPING END ---") {
    $jsonContent = $matches[1]
}
else {
    Write-Error "Could not find JSON mapping in $mappingPath"
    exit 1
}

$mapping = $jsonContent | ConvertFrom-Json
$mockData = Get-Content -Path $mockDataPath -Raw

$updatedCount = 0

foreach ($key in $mapping.PSObject.Properties.Name) {
    $newPath = $mapping.$key
    
    # Escape special regex characters in the key
    $escapedKey = [Regex]::Escape($key)
    
    # Pattern: name: 'Key', ... image: 'OldPath'
    # We want to replace the content of image: '...' for the item with name: 'Key'
    
    # We use a pattern that finds the name, then looks ahead for the image field
    # But PowerShell regex replacement is global or tricky with complex lookaheads across multiple lines
    # Simplification: We assume image comes after name within reasonable distance
    
    # Regex explanation:
    # (name:\s*['"]$escapedKey['"],[\s\S]*?image:\s*['"])([^'"]+)(['"])
    
    $pattern = "(name:\s*['`"]$escapedKey['`"],[\s\S]*?image:\s*['`"])([^'`"]+)(['`"])"
    
    if ($mockData -match $pattern) {
        $mockData = [Regex]::Replace($mockData, $pattern, '${1}' + $newPath + '${3}')
        Write-Host "Updated image for: $key -> $newPath"
        $updatedCount++
    }
    else {
        Write-Host "Could not find menu item in mockData for: $key"
    }
}

$mockData | Set-Content -Path $mockDataPath -Encoding UTF8
Write-Host "Total updated items: $updatedCount"
