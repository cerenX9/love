<#
.SYNOPSIS
    Ceren & Tahir Love Hub - Cloudflare Zero Trust Windows Service Kurulum Betiği
#>

param (
    [string]$TunnelToken
)

$Host.UI.RawUI.WindowTitle = "Cloudflare Tunnel Service Setup"
Write-Host "==================================================================" -ForegroundColor Magenta
Write-Host "  CEREN & TAHİR LOVE HUB - CLOUDFLARE ZERO TRUST TÜNEL DAEMON KURULUMU  " -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Magenta
Write-Host ""

$binPath = Join-Path $PSScriptRoot "..\bin\cloudflared.exe"

if (-not (Test-Path $binPath)) {
    Write-Error "cloudflared.exe bulunamadı: $binPath"
    exit 1
}

# Admin kontrolü
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Warning "Bu betik Windows Servisi kurabilmek için Yönetici (Administrator) yetkisi gerektirir."
    Write-Host "Lütfen PowerShell'i 'Yönetici Olarak Çalıştır' seçeneğiyle açıp tekrar deneyin." -ForegroundColor Yellow
}

if (-not $TunnelToken) {
    Write-Host "Cloudflare Zero Trust panelinden aldığınız token'ı girin:" -ForegroundColor Green
    $TunnelToken = Read-Host "Token"
}

if ($TunnelToken) {
    # Token içinden gereksiz komut metinlerini temizle
    $cleanToken = $TunnelToken -replace "cloudflared(\.exe)?\s+service\s+install\s+", ""
    $cleanToken = $cleanToken.Trim()

    Write-Host "Windows Servisi kuruluyor..." -ForegroundColor Cyan
    & $binPath service install $cleanToken

    Write-Host "Servis başlatılıyor..." -ForegroundColor Cyan
    Start-Service -Name "cloudflared" -ErrorAction SilentlyContinue

    Write-Host "Servis Durumu:" -ForegroundColor Yellow
    Get-Service -Name "cloudflared" | Format-Table -AutoSize

    Write-Host "Kurulum tamamlandı! Bilgisayar açık olduğu sürece tünel otomatik çalışacaktır." -ForegroundColor Green
}
