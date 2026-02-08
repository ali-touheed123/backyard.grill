
$sourceDir = "image"
$destDir = "public\menu"

if (-not (Test-Path -Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}

$mapping = @{}

$files = Get-ChildItem -Path $sourceDir -File

foreach ($file in $files) {
    $extension = $file.Extension.ToLower()
    
    if ([string]::IsNullOrEmpty($extension) -or $extension -eq ".") {
        # Read first 12 bytes to guess extension
        $bytes = Get-Content -Path $file.FullName -Encoding Byte -TotalCount 12
        
        # JPEG: FF D8 FF
        if ($bytes[0] -eq 0xFF -and $bytes[1] -eq 0xD8 -and $bytes[2] -eq 0xFF) {
            $extension = ".jpg"
        }
        # PNG: 89 50 4E 47
        elseif ($bytes[0] -eq 0x89 -and $bytes[1] -eq 0x50 -and $bytes[2] -eq 0x4E -and $bytes[3] -eq 0x47) {
            $extension = ".png"
        }
        # WebP: RIFF...WEBP
        elseif ($bytes[0] -eq 0x52 -and $bytes[1] -eq 0x49 -and $bytes[2] -eq 0x46 -and $bytes[3] -eq 0x46 -and 
                $bytes[8] -eq 0x57 -and $bytes[9] -eq 0x45 -and $bytes[10] -eq 0x42 -and $bytes[11] -eq 0x50) {
            $extension = ".webp"
        }
    }
    
    if (-not $extension) {
        Write-Host "Could not determine extension for $($file.Name)"
        continue
    }

    $nameWithoutExt = $file.BaseName
    
    # Sanitize filename: lowercase, replace spaces with hyphens, remove special chars
    $newName = $nameWithoutExt.ToLower() -replace '\s+', '-' -replace '[^a-z0-9-]', ''
    $newName = $newName + $extension
    
    $destPath = Join-Path -Path $destDir -ChildPath $newName
    
    Copy-Item -Path $file.FullName -Destination $destPath
    
    # Store mapping: original name -> new web path
    $mapping[$nameWithoutExt] = "/menu/$newName"
    
    Write-Host "Processed: $($file.Name) -> $newName"
}

Write-Host "--- MAPPING START ---"
$mapping | ConvertTo-Json
Write-Host "--- MAPPING END ---"
