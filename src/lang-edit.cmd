@echo off

rem deno run --allow-all --unstable-ffi lang-edit.ts %*

SetLocal EnableDelayedExpansion EnableExtensions

set data=C:\...\deno
set editor=C:\...\lang-edit.ts

call :get_file_path filePath %1
call :get_file_lang fileLang %filePath%

pushd %data%
deno run --allow-all --unstable-ffi %editor% -i %fileLang% %filePath%
popd 
goto :eof

:get_file_lang <resultVar> <filenameVar>
(
    set filename=%~2
    for /f "tokens=2* delims=\" %%i in ("!filename:*\lang-=!") do (set "%~1=%%i")
    exit /b
)

:get_file_path <resultVar> <pathVar>
(
    set "%~1=%~f2"
    exit /b
)

:eof
EndLocal