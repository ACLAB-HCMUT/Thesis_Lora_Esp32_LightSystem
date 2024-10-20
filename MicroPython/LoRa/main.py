import LoRa
from machine import Timer
import time

def main():
    timer = Timer(0)
    timer.init(freq=10, mode=Timer.PERIODIC, callback=LoRa.uart_callback)
    
    lora = LoRa.LoRa()
    print("Hello from LoRa")
    lora.enable_config_mode()
    lora.set_reg0()
    while True:
        time.sleep(1)

if __name__ == "__main__":
    main()