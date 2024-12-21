@echo off
:: Set default port to COM8
set "port=COM8"

:: Check if the user provided a port argument
if not "%2"=="" (
    set "port=%2"
)

:: Run the ampy command with the provided or default port
echo Using port: %port%
echo Put LoRa.py
ampy --port %port% put MicroPython\LoRa\LoRa.py
echo Put message.py
ampy --port %port% put MicroPython\LoRa\message.py
echo Put configParam.py
ampy --port %port% put MicroPython\LoRa\configParam.py
echo Put led.py
ampy --port %port% put MicroPython\LedRGB\led.py
echo Put softwareTimer.py
ampy --port %port% put MicroPython\utils\softwareTimer.py

:: Run program
if "%1"=="config" (
    ampy --port %port% run MicroPython\LoRa\configLoRa.py
) else (
    ampy --port %port% run MicroPython\LoRa\main.py
)
