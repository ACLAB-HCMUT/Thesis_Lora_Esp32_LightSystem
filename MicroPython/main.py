import time
from LedRGB import led
from LoRa import LoRa
from machine import Timer

# Setup all neccesary objects
state = 0
led.init()
lora = LoRa.LoRa()
timer_0 = Timer(0)
timer_0.init(freq=10, mode=Timer.PERIODIC, callback=LoRa.uart_callback)

def FSM_LedRGB(state):
    if state == 0:
        led.red()
    elif state == 1:
        led.blue()
    elif state == 2:
        led.yellow()
    elif state == 3:
        led.purple()
    elif state == 4:
        led.cyan()
    elif state == 5:
        led.green()
    else:
        print("Wrong state")

def loop():
    global state, lora
    lora.enable_config_mode()
    while True:
        state = (state + 1) % 6
        FSM_LedRGB(state)
        if state == 1:
            lora.set_reg3(Transparent=False)
        time.sleep(1)
        
def main():
    print("Hello from ATOM Lite")
    loop()

if __name__ == "__main__":
    main()
    