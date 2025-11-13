@echo off
setlocal enabledelayedexpansion

:: Kaynak klasör ve dosya
set TARGET_PREFIX=Auth
set SOURCE_FOLDER_PATH=\src\Constants
set SOURCE_FOLDER=\Privileges.js
set SOURCE=%TARGET_PREFIX%%SOURCE_FOLDER_PATH%%SOURCE_FOLDER%

:: Hedef prefixler listesi
set PREFIXES=Business Log Setting System Userrole Warehouse

for %%P in (%PREFIXES%) do (
    :: Target klasörü es geç
    if /I not "%%P"=="%TARGET_PREFIX%" (
        if exist "%%P" (
            set TARGET_DIR=%%P%SOURCE_FOLDER_PATH%
            if not exist "!TARGET_DIR!" (
                mkdir "!TARGET_DIR!"
            )
            :: Dosyayı kopyala ve var olanın üstüne yaz
            xcopy /Y "%SOURCE%" "!TARGET_DIR!\"
        )
    )
)

echo Kopyalama tamamlandı.
