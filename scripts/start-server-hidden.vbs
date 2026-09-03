' Silent persistent background web server runner for Ceren & Tahir Love Hub
Set WshShell = CreateObject("WScript.Shell")
strCurDir = WshShell.CurrentDirectory
' Run npm run preview on port 5173 with window style 0 (completely invisible background process)
WshShell.Run "cmd.exe /c cd /d """ & strCurDir & """ && npm run preview -- --port 5173 --host", 0, False
