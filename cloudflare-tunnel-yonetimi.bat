@echo off
chcp 65001 >nul
title Ceren ❤️ Tahir Love Hub - Kesintisiz Sunucu ve Tünel Yöneticisi
color 0C

:: Otomatik Yönetici (Administrator) İzni Alma
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Yönetici izni isteniyor, lütfen açılan pencerede "Evet"e tıklayın...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

set "STARTUP_VBS=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\StartLoveHub.vbs"
set "BIN_PATH=%~dp0bin\cloudflared.exe"

:MENU
cls
echo ==============================================================================
echo             CEREN & TAHİR LOVE HUB - KESİNTİSİZ ÇALIŞTIRMA MERKEZİ
echo ==============================================================================
echo.
echo   [1] Cloudflare Zero Trust Servisini Kur (Fotoğraftaki Taktik)
echo   [2] Web Sunucusunu Windows Başlangıcına Ekle (PC Açılınca Arkada Başlasın)
echo   [3] Web Sunucusunu Hemen Arka Planda Başlat (Terminal Kapansa da Çalışır)
echo   [4] Tüm Sistem Durumunu Kontrol Et (Tünel + Web Sunucusu)
echo.
echo   [5] Web Sunucusunu Windows Başlangıcından Kaldır
echo   [6] Arka Plandaki Web Sunucusunu Durdur
echo   [7] Cloudflare Servisini Başlat
echo   [8] Cloudflare Servisini Durdur
echo   [9] Cloudflare Servisini Kaldır (Uninstall)
echo   [B] Projeyi Optimize Ederek Derle (Build)
echo   [Q] Geçici Quick Tunnel Başlat (Test için)
echo   [0] Çıkış
echo ==============================================================================
set /p SECIM="Lütfen bir işlem seçin: "

if /i "%SECIM%"=="1" goto KURULUM
if /i "%SECIM%"=="2" goto EKLE_STARTUP
if /i "%SECIM%"=="3" goto BASLAT_ARKA_PLAN
if /i "%SECIM%"=="4" goto DURUM
if /i "%SECIM%"=="5" goto SIL_STARTUP
if /i "%SECIM%"=="6" goto DURDUR_ARKA_PLAN
if /i "%SECIM%"=="7" goto BASLAT_SERVIS
if /i "%SECIM%"=="8" goto DURDUR_SERVIS
if /i "%SECIM%"=="9" goto KALDIR_SERVIS
if /i "%SECIM%"=="B" goto DERLE
if /i "%SECIM%"=="Q" goto HIZLI_TUNEL
if /i "%SECIM%"=="0" exit
goto MENU

:KURULUM
cls
echo ==============================================================================
echo            1. ADIM: CLOUDFLARE ZERO TRUST TÜNEL SERVİSİ KURULUMU
echo ==============================================================================
echo.
echo Fotoğraftaki adımları uyguluyoruz:
echo 1) Tarayıcınızda one.dash.cloudflare.com adresine gidin.
echo 2) Sol menüden Networks -> Tunnels sekmesinden "Add a tunnel" deyin.
echo 3) "Cloudflared" seçip tünele isim verin (örn: ceren-tahir).
echo 4) Ekranda "Install and run a connector" bölümünde Windows seçildiğinde
echo    size uzun bir komut verecektir:
echo    "cloudflared.exe service install eyJh..."
echo.
echo Lütfen o komuttaki eyJh... ile başlayan TOKEN kodunu (veya tüm komutu) buraya yapıştırın:
echo.
set /p TOKEN="Token veya komutu yapıştırın: "

if "%TOKEN%"=="" (
    echo.
    echo [HATA] Token boş bırakılamaz. Menüye dönülüyor...
    pause
    goto MENU
)

:: Token temizleme
set "CLEAN_TOKEN=%TOKEN%"
set "CLEAN_TOKEN=%CLEAN_TOKEN:cloudflared.exe=%"
set "CLEAN_TOKEN=%CLEAN_TOKEN:cloudflared=%"
set "CLEAN_TOKEN=%CLEAN_TOKEN:service=%"
set "CLEAN_TOKEN=%CLEAN_TOKEN:install=%"
for /f "tokens=*" %%a in ("%CLEAN_TOKEN%") do set "CLEAN_TOKEN=%%a"

echo.
echo [*] Cloudflare servisi kuruluyor...
echo [*] Konum: %BIN_PATH%
echo.

"%BIN_PATH%" service install %CLEAN_TOKEN%
sc config cloudflared start= auto >nul 2>&1
sc start cloudflared >nul 2>&1

echo.
echo ==============================================================================
echo [BAŞARILI] Cloudflare servisi Windows Arka Plan Servisi (daemon) olarak kuruldu!
echo.
echo Şimdi Cloudflare Zero Trust panelinden 4. Adım (Public Hostname) ayarını yapın:
echo   - Subdomain: love (veya istediğiniz bir isim)
echo   - Domain: alanadiniz.com
echo   - Type / Service: HTTP
echo   - URL: localhost:5173
echo.
echo [ÖNERİ] Şimdi menüden [2] numaralı seçeneği seçerek web sunucusunun da PC
echo açıldığında otomatik çalışmasını sağlayın!
echo ==============================================================================
pause
goto MENU

:EKLE_STARTUP
cls
echo ==============================================================================
echo        WEB SUNUCUSUNU WİNDOWS BAŞLANGICINA (STARTUP) EKLEME
echo ==============================================================================
echo.
echo [*] Proje önce en güncel haliyle derleniyor...
cd /d "%~dp0"
call npm.cmd run build
echo.
echo [*] Windows Başlangıç dosyası oluşturuluyor...
(
echo Set WshShell = CreateObject^("WScript.Shell"^)
echo WshShell.Run "cmd.exe /c cd /d ""%~dp0"" ^&^& npm.cmd run preview -- --port 5173 --host", 0, False
) > "%STARTUP_VBS%"

echo.
echo [BAŞARILI] Web sunucusu Windows Başlangıcına eklendi!
echo Dosya: %STARTUP_VBS%
echo.
echo Artık bilgisayarınız her açıldığında web sunucusu arka planda görünmez şekilde
echo otomatik çalışacak. Siz hiçbir şeye tıklamak zorunda kalmayacaksınız!
echo.
echo Şimdi sunucuyu hemen başlatmak istiyor musunuz? (E/H)
set /p BASLAT_SIMDI="Seçiminiz (E/H): "
if /i "%BASLAT_SIMDI%"=="E" (
    wscript.exe "%STARTUP_VBS%"
    echo [OK] Web sunucusu arka planda başlatıldı!
)
pause
goto MENU

:SIL_STARTUP
cls
echo [*] Windows Başlangıç dosyası kaldırılıyor...
if exist "%STARTUP_VBS%" (
    del /f /q "%STARTUP_VBS%"
    echo [BAŞARILI] Başlangıç dosyası silindi.
) else (
    echo [BİLGİ] Zaten başlangıçta dosya bulunmuyor.
)
pause
goto MENU

:BASLAT_ARKA_PLAN
cls
echo [*] Proje derleniyor...
cd /d "%~dp0"
call npm.cmd run build
echo.
echo [*] Web sunucusu arka planda başlatılıyor (Port 5173)...
wscript.exe "%~dp0scripts\start-server-hidden.vbs"
echo.
echo [BAŞARILI] Web sunucusu görünmez arka plan modunda çalışıyor!
echo Port: 5173 (localhost:5173)
pause
goto MENU

:DURDUR_ARKA_PLAN
cls
echo [*] Arka plandaki Node / Vite sunucusu kapatılıyor...
taskkill /f /im node.exe >nul 2>&1
echo [TAMAMLANDI] Web sunucusu durduruldu.
pause
goto MENU

:DURUM
cls
echo ==============================================================================
echo                          SİSTEM DURUM RAPORU
echo ==============================================================================
echo.
echo [1] Cloudflare Windows Servisi (cloudflared):
sc query cloudflared | findstr "STATE"
if %errorlevel% neq 0 echo     Durum: Servis henüz kurulmamış veya durdurulmuş.
echo.
echo [2] Web Sunucusu Port Kontrolü (5173):
netstat -ano | findstr ":5173" | findstr "LISTENING"
if %errorlevel% equ 0 (
    echo     Durum: [AKTİF] Port 5173 dinleniyor, sunucu çalışıyor!
) else (
    echo     Durum: [KAPALI] Port 5173 şu an dinlenmiyor.
)
echo.
echo [3] Windows Başlangıç Otomasyonu:
if exist "%STARTUP_VBS%" (
    echo     Durum: [AKTİF] Bilgisayar açıldığında otomatik başlama ayarlı!
) else (
    echo     Durum: [PASİF] Başlangıçta otomatik başlama henüz ayarlanmamış.
)
echo.
echo ==============================================================================
pause
goto MENU

:BASLAT_SERVIS
cls
echo [*] Cloudflare servisi başlatılıyor...
sc start cloudflared
pause
goto MENU

:DURDUR_SERVIS
cls
echo [*] Cloudflare servisi durduruluyor...
sc stop cloudflared
pause
goto MENU

:KALDIR_SERVIS
cls
echo [*] Cloudflare servisi kaldırılıyor...
"%BIN_PATH%" service uninstall
pause
goto MENU

:DERLE
cls
echo [*] Proje derleniyor...
cd /d "%~dp0"
call npm.cmd run build
pause
goto MENU

:HIZLI_TUNEL
cls
echo [*] Geçici Quick Tunnel başlatılıyor...
echo (Bu tünel terminal açık olduğu sürece çalışır)
"%BIN_PATH%" tunnel --url http://localhost:5173
pause
goto MENU
