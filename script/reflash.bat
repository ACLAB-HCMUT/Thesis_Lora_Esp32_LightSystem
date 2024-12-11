@echo off
:: Set default port to COM8
set "port=COM8"

:: Check if the user provided a port argument
if not "%2"=="" (
    set "port=%2"
)

:: Run the ampy command with the provided or default port
echo Using port: %port%
esptool --port %port% --chip auto erase_flash
esptool --port %port% --chip auto write_flash 0x1000 MicroPython/firmware/M5STACK_ATOM-20240602-v1.23.0.bin
echo Flash success