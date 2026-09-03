@echo off
chcp 65001 >nul
title Ceren ❤️ Tahir Love Hub - Cloudflare Tünel ve Kesintisiz Sunucu Yöneticisi
color 0C

:MENU
cls
echo ==============================================================================
echo             CEREN & TAHİR LOVE HUB - KESİNTİSİZ ÇALIŞTIRMA MERKEZİ
echo ==============================================================================
echo.
echo   [1] Cloudflare Zero Trust Servisini Kur (Kalıcı Arka Plan Daemon'ı)
echo   [2] Cloudflare Servis Durumunu Kontrol Et
echo   [3] Cloudflare Servisini Başlat
echo   [4] Cloudflare Servisini Durdur
echo   [5] Cloudflare Servisini Kaldır (Uninstall)
echo.
echo   [6] Arka Planda Web Sunucusunu Başlat (Terminali Kapatsanız da Çalışır!)
echo   [7] Arka Plandaki Web Sunucusunu Durdur
echo   [8] Web Sunucusunu Normal Ekranda Başlat (Canlı logları gör)
echo.
echo   [9] Hızlı Geçici Tünel Başlat (Quick Tunnel - test amaçlı)
echo   [0] Çıkış
echo ==============================================================================
set /p SECIM="Lütfen bir işlem seçin (0-9): "

if "%SECIM%"=="1" goto KURULUM
if "%SECIM%"=="2" goto DURUM
if "%SECIM%"=="3" goto BASLAT_SERVIS
if "%SECIM%"=="4" goto DURDUR_SERVIS
if "%SECIM%"=="5" goto KALDIR_SERVIS
if "%SECIM%"=="6" goto BASLAT_ARKA_PLAN
if "%SECIM%"=="7" goto DURDUR_ARKA_PLAN
if "%SECIM%"=="8" goto BASLAT_NORMAL
if "%SECIM%"=="9" goto HIZLI_TUNEL
if "%SECIM%"=="0" exit
goto MENU

:KURULUM
cls
echo ==============================================================================
echo            1. ADIM: CLOUDFLARE ZERO TRUST TÜNEL SERVİSİ KURULUMU
echo ==============================================================================
echo.
echo Fotoğraftaki taktiği uyguluyoruz:
echo 1) Tarayıcınızda one.dash.cloudflare.com adresine gidin.
echo 2) Networks -> Tunnels sekmesinden "Add a tunnel" deyin.
echo 3) "Cloudflared" seçip tünele isim verin (örn: ceren-tahir-sunucu).
echo 4) Ekranda "Install and run a connector" bölümünde Windows seçildiğinde
echo    size uzun bir komut verecektir:
echo    "cloudflared.exe service install eyJh..."
echo.
echo Lütfen o komuttaki eyJh... ile başlayan TOKEN kodunu buraya yapıştırın:
echo (Veya Cloudflare panelindeki komutun tamamını da yapıştırabilirsiniz)
echo.
set /p TOKEN="Token veya komutu yapıştırın: "

if "%TOKEN%"=="" (
    echo.
    echo [HATA] Boş bırakılamaz. Menüye dönülüyor...
    pause
    goto MENU
)

:: Eğer kullanıcı komutun tamamını yapıştırdıysa token'ı ayıkla
set "CLEAN_TOKEN=%TOKEN%"
set "CLEAN_TOKEN=%CLEAN_TOKEN:cloudflared.exe=%"
set "CLEAN_TOKEN=%CLEAN_TOKEN:cloudflared=%"
set "CLEAN_TOKEN=%CLEAN_TOKEN:service=%"
set "CLEAN_TOKEN=%CLEAN_TOKEN:install=%"
for /f "tokens=*" %%a in ("%CLEAN_TOKEN%") do set "CLEAN_TOKEN=%%a"

echo.
echo [*] Cloudflare servisi kuruluyor...
echo [*] Konum: %~dp0bin\cloudflared.exe
echo.

"%~dp0bin\cloudflared.exe" service install %CLEAN_TOKEN%
if %errorlevel% neq 0 (
    echo.
    echo [!] Hata oluştu. Bu işlemi "Yönetici Olarak Çalıştır" (Run as Administrator)
    echo     ile başlattığınızdan emin olun!
) else (
    echo.
    echo [BASARILI] Cloudflare servisi Windows Arka Plan Servisi (daemon) olarak kuruldu!
    echo Bilgisayar yeniden başlasa bile tünel arkada otomatik olarak çalışacaktır.
    echo.
    echo Şimdi Cloudflare Zero Trust panelinden 4. Adım (Public Hostname) ayarını yapın:
    echo  - Subdomain: app (veya sevdiğiniz bir kelime)
    echo  - Domain: alanadiniz.com
    echo  - Service: HTTP
    echo  - URL: localhost:5173
)
pause
goto MENU

:DURUM
cls
echo [*] Cloudflare servis durumu denetleniyor...
sc query cloudflared
echo.
pause
goto MENU

:BASLAT_SERVIS
cls
echo [*] Cloudflare servisi başlatılıyor...
sc start cloudflared
echo.
pause
goto MENU

:DURDUR_SERVIS
cls
echo [*] Cloudflare servisi durduruluyor...
sc stop cloudflared
echo.
pause
goto MENU

:KALDIR_SERVIS
cls
echo [*] Cloudflare servisi kaldırılıyor...
"%~dp0bin\cloudflared.exe" service uninstall
echo.
pause
goto MENU

:BASLAT_ARKA_PLAN
cls
echo [*] Proje derleniyor ve optimize ediliyor...
cd /d "%~dp0"
call npm run build
echo.
echo [*] Web sunucusu arka planda görünmez şekilde başlatılıyor...
wscript.exe "%~dp0scripts\start-server-hidden.vbs"
echo.
echo [BAŞARILI] Web sunucusu arka planda çalışıyor (Port 5173).
echo Terminal kapansa bile sunucu asla kapanmaz!
echo.
pause
goto MENU

:DURDUR_ARKA_PLAN
cls
echo [*] Arka planda çalışan Vite/Node sunucusu kapatılıyor...
taskkill /f /im node.exe >nul 2>&1
echo [TAMAMLANDI] Arka plan sunucuları durduruldu.
pause
goto MENU

:BASLAT_NORMAL
cls
echo [*] Web sunucusu görünür terminal modunda başlatılıyor...
cd /d "%~dp0"
call npm run preview -- --port 5173 --host
pause
goto MENU

:HIZLI_TUNEL
cls
echo [*] Geçici Quick Tunnel başlatılıyor...
"%~dp0bin\cloudflared.exe" tunnel --url http://localhost:5173
pause
goto MENU
