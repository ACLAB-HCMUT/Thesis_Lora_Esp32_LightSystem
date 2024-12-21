@echo off
:: Set default port to COM8
set "port=COM4"

:: Check if the user provided a port argument
if not "%2"=="" (
    set "port=%2"
)

:: Run the ampy command with the provided or default port
echo Using port: %port%
ampy --port %port% put MicroPython\aws_cert_ca.pem
ampy --port %port% put MicroPython\cert.pem.crt
ampy --port %port% put MicroPython\private.pem.key
ampy --port %port% mkdir umqtt
ampy --port %port% put MicroPython\umqtt\simple.py umqtt/simple.py
ampy --port %port% put MicroPython\LoRa
ampy --port %port% put MicroPython\config_aws.py
ampy --port %port% put MicroPython\gateway.py

:: Run program
if "%1"=="aws" (
    ampy --port %port% run MicroPython\gateway.py
) 