# Quick start for using MicroPyhton with ATOM Lite
## 1. Build virtual environment connect directly to ATOM Lite by PC.
1. Set up Python virtual environment in the workingspace folder by the command: `py -3.11 -m venv .venv`.
2. Activate the environment that you set up: `.\.venv\Scripts\Activate.ps1`.
3. Install `ampy` (this is used for connecting to working space on ESP32 chip in ATOM Lite) and `esptool` (use to interact with ESP32 chip in ATOM Lite). The command is: `pip install adafruit-ampy esptool`.
4. The next step is a necessary for the first time you work with new ATOM Lite. That is erase `flash_memory`. 
   - Command to erase flash: `esptool.exe --port <port-name> --chip auto erase_flash` 
   - Example: `esptool.exe --port COM6 --chip auto erase_flash`.
5. After clearing flash memory, we should upload firmware for ESP32 and put it to the chip in ATOM Lite. 
   - Command is: `esptool.exe --port /*port name*/ --chip /*chip type*/ write_flash 0x1000 /* firmware file */`. Note that firmware file is in `firmware` folder.
   - Example: `esptool.exe --port COM6 --chip esp32 write_flash 0x1000 M5STACK_ATOM-20240602-v1.23.0.bin`.
6. Put file to chip by cmd: 
   - Command: `ampy.exe --port /*port name*/ put /* file name*/`.
   - Example: `ampy.exe --port COM6 put main.py`.
7. To run file on chip, use cmd: 
   - Command: `ampy.exe --port /*port name*/ run /* file name */`.
   - Example: `ampy.exe --port COM6 run main.py`.

# Resolved problems
## 1. The program will terminate after 10 seconds if there is no output to the terminal.
Error code: `ampy.pyboard.PyboardError: timeout waiting for first EOF reception`

Approach 1: Modify source code of `ampy` library
1. Find the `pyboard.py` in the `ampy` library. 
   Example: I use the virtual environment so the path will look like `.\.venv\Lib\site-packages\ampy\pyboard.py`
2. Find the function named `exec_raw` and modify the default parameter `timeout` from `timeout=10` to `timeout=None`
3. Run the program again with command `ampy run`

Approach 2: Print the dump value to terminal
1. Using a command print dump value like `print("\0", end="")` in main loop and make sure that command will be executed at least 1 time per 10 seconds.
2. Run the program again with command `ampy run`

## 2. Permission denied when activating virtual environment
Issue:
```bash
.venv\Scripts\Activate.ps1 cannot be loaded because running scripts is disabled on this system.
```
Solution:
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
