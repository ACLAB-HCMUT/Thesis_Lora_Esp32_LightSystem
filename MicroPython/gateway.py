from LoRa.LoRa import LoRa
from LoRa.message import *
from machine import Timer
import time
import binascii
import os
from config_aws import *

broadcast_address = bytes(b'\xff\xff')
def ping_callback(timer):
    msg_back = ping_pack(address_encode(lora.address),broadcast_address )
    lora.send_raw_msg(msg_back,address_decode(broadcast_address),int(lora.channel))

def uart_callback(timer):
    global lora, msg
    if lora.UART_1.any():
        # msg = binascii.hexlify(lora.UART_1.read())
        msg = (lora.UART_1.read())
        print(f"Receive from LoRa: {msg}")
        src_addr, des_addr = ping_unpack(msg)
        print("source = " + address_decode(src_addr))
        print("destination = " + address_decode(des_addr))
        payload = format_package(address_decode(src_addr))
        print(payload)
        mqtt = get_mqtt()
        mqtt_publish(client=mqtt,message=payload)

def loop():
    global lora
    while True:
        time.sleep(1)
    
def setup():
    global lora, timer0, timer1
    print("hello from LoRa")
    # Create LoRa instance
    lora = LoRa()
    
    # Timer for FSM
    timer0 = Timer(0)
    timer0.init(freq=10, mode=Timer.PERIODIC, callback=uart_callback)

    # Timer for Gateway to ping Node
    timer1 = Timer(1)
    timer1.init(freq=0.2, mode=Timer.PERIODIC, callback=ping_callback)
    
def main():
    setup_config()
    setup()
    loop()

if __name__ == "__main__":
    main()
    