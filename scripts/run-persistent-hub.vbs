' Ceren & Tahir Love Hub - Kesintisiz Arka Plan Baslatici
Set WshShell = CreateObject("WScript.Shell")
strDir = "c:\Users\ceren\OneDrive\Desktop\111"

' 1. Web Sunucusunu baslat (Port 5173)
WshShell.Run "cmd.exe /c cd /d """ & strDir & """ && npm.cmd run preview -- --port 5173 --host", 0, False

WshShell.Run "cmd.exe /c cd /d """ & strDir & """ && .\bin\cloudflared.exe tunnel run --token eyJhIjoiZGU0YjRiZjE3M2RhNjM0ZGI4NGVmNWQ3YTMyNzFiZDEiLCJ0IjoiYzg1MDQxMTgtYmI4Zi00ZjRmLTg3NTgtZTQzZDE0MmYxYTcwIiwicyI6IlptVTBOR1l5WVRndE5tWTNPQzAwTWpRM0xXSTRabU10TWpFMllqTTBNall4TlRFMyJ9", 0, False
