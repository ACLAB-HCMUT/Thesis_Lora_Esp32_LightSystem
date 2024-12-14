import LoRa
from message import *
import softwareTimer
from machine import Timer
import time
import binascii

GTW_ADDRESS = bytes(b'\x00\x01')

def uart_callback(timer):
    global lora, msg, msg_buffer
    if lora.UART_1.any():
        msg = lora.UART_1.read()
        msg_buffer.append(msg)
        # lora.send_raw_msg(address_encode(lora.address) + msg[:2], address_decode(msg[:2]), 1)
        if LoRa.DEBUG:
            print(f"Received message: {msg}")

def loop():
    global lora
    while True:
        if softwareTimer.getFlag(0):
            msg = ping_pack(address_encode(lora.address), address_encode('ffff'))
            lora.send_raw_msg(msg, 'ffff', 1)
    
def setup():
    global lora, timer0, msg_buffer
    print("hello from LoRa")
    # Create LoRa instance
    lora = LoRa.LoRa()
    softwareTimer.initSoftwareTimer()
    msg_buffer = []
    
    # Timer for FSM
    timer0 = Timer(0)
    timer0.init(freq=10, mode=Timer.PERIODIC, callback=uart_callback)
    timer1 = Timer(1)
    timer1.init(period=softwareTimer.PERIOD_TICK, mode=Timer.PERIODIC, callback=softwareTimer.timerCallback)
    
    # Set software timer
    softwareTimer.setTimer(0, 1000)    
    
def main():
    setup()
    loop()

if __name__ == "__main__":
    main()
    