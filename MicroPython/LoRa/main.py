import LoRa
from message import *
from machine import Timer
import time
import binascii

def uart_callback(timer):
    global lora, msg
    if lora.UART_1.any():
        # msg = binascii.hexlify(lora.UART_1.read())
        msg = (lora.UART_1.read())
        print(f"Receive from LoRa: {msg}")
        msg = bytearray(msg)
        print(f"msg[0] = {msg[0]}")


def loop():
    global lora
    with open("config.txt", "r") as file:
        configs = [line.split(' ')[1][:-2] for line in file.readlines()]
        my_address = address_encode(configs[0])
        target_address = address_encode('0001')
    while True:
        
        time.sleep(1)
    
def setup():
    global lora, timer0
    print("hello from LoRa")
    # Create LoRa instance
    lora = LoRa.LoRa()
    
    # Timer for FSM
    timer0 = Timer(0)
    timer0.init(freq=10, mode=Timer.PERIODIC, callback=uart_callback)
    
def main():
    setup()
    loop()

if __name__ == "__main__":
    main()
    