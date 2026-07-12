# ─────────────────────────────────────────────────────────────────────────────
# Regenerates every optimized image the site ships from the full-resolution
# masters in /photos-original (git-ignored — masters stay on this machine).
#
#   photos-original\*.jpg|*.png         → public\images\web\<name>.jpg   (long side 1600)
#   photos-original\marquee\*.jpg|*.png → src\assets\marquee\marquee_NN.jpg (height 320)
#
# Run after adding or replacing photos, then commit the regenerated files:
#   npm run photos
#
# Everything the site references lives in public/images/web and
# src/assets/marquee, both committed to git — so a deploy always shows
# exactly what you see locally.
# ─────────────────────────────────────────────────────────────────────────────
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$masters = Join-Path $root 'photos-original'
$webOut = Join-Path $root 'public\images\web'
$marqueeIn = Join-Path $masters 'marquee'
$marqueeOut = Join-Path $root 'src\assets\marquee'

if (-not (Test-Path $masters)) {
  Write-Error "Masters folder not found: $masters"
  exit 1
}
New-Item -ItemType Directory -Force $webOut | Out-Null
New-Item -ItemType Directory -Force $marqueeOut | Out-Null

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }

function Save-Resized {
  param([string]$InPath, [string]$OutPath, [double]$Scale, [long]$Quality)
  $img = [System.Drawing.Image]::FromFile($InPath)
  try {
    if ($Scale -gt 1) { $Scale = 1 }
    $w = [int][Math]::Round($img.Width * $Scale)
    $h = [int][Math]::Round($img.Height * $Scale)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose()
    $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
    $bmp.Save($OutPath, $jpegCodec, $ep)
    $bmp.Dispose()
    $ep.Dispose()
  } finally {
    $img.Dispose()
  }
  Write-Output ("  {0} ({1:n0} KB)" -f (Split-Path $OutPath -Leaf), ((Get-Item $OutPath).Length / 1KB))
}

function Get-LongSide {
  param([string]$Path)
  $img = [System.Drawing.Image]::FromFile($Path)
  $long = [Math]::Max($img.Width, $img.Height)
  $height = $img.Height
  $img.Dispose()
  return @{ Long = $long; Height = $height }
}

Write-Output 'Site photos -> public/images/web'
# Top level of /photos-original only — the marquee subfolder is handled below.
Get-ChildItem (Join-Path $masters '*') -File -Include *.jpg, *.jpeg, *.png | ForEach-Object {
  $dims = Get-LongSide $_.FullName
  $outName = [System.IO.Path]::GetFileNameWithoutExtension($_.Name) + '.jpg'
  Save-Resized -InPath $_.FullName -OutPath (Join-Path $webOut $outName) -Scale (1600 / $dims.Long) -Quality 82
}

Write-Output 'Marquee thumbnails -> src/assets/marquee'
Remove-Item (Join-Path $marqueeOut 'marquee_*.jpg') -ErrorAction SilentlyContinue -Confirm:$false
$n = 0
Get-ChildItem $marqueeIn -File -Include *.jpg, *.jpeg, *.png -Recurse | Sort-Object Name | ForEach-Object {
  $n++
  $dims = Get-LongSide $_.FullName
  $name = 'marquee_{0:d2}.jpg' -f $n
  Save-Resized -InPath $_.FullName -OutPath (Join-Path $marqueeOut $name) -Scale (320 / $dims.Height) -Quality 75
}
Write-Output "Done: $n marquee thumbnails."
