import LoRa
from message import *
from machine import Timer
import time
import binascii
import os

def uart_callback(timer):
    global lora, msg
    if lora.UART_1.any():
        # msg = binascii.hexlify(lora.UART_1.read())
        msg = (lora.UART_1.read())
        print(f"Receive from LoRa: {msg}")
        src_addr, des_addr = ping_unpack(msg)
        print("source = " + address_decode(src_addr))
        print("destination = " + address_decode(des_addr))
        msg_back = ping_pack(address_encode(lora.address),src_addr)
        lora.send_raw_msg(msg_back,address_decode(src_addr),int(lora.channel))
        

def loop():
    global lora
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
    