import LoRa
from message import *
import softwareTimer
import led

from machine import Timer
import time
import binascii

GTW_ADDRESS = bytes(b'\x00\x01')

def uart_callback(timer):
    global lora, msg_buffer, have_msg
    if lora.UART_1.any():
        msg = lora.UART_1.read()
        if STOP_BYTE in msg:
            have_msg = True
        msg_buffer.append(msg)
        # lora.send_raw_msg(address_encode(lora.address) + msg[:2], address_decode(msg[:2]), 1)
        if LoRa.DEBUG:
            print(f"Received message: {msg}")

def process_msg():
    global msg_buffer
    full_msg = bytearray()
    state = 0
    while len(msg_buffer) > 0:
        if state == 0:
            # Waiting START_BYTE
            start_idx = msg_buffer[0].find(START_BYTE)
            if start_idx != -1:
                stop_idx = msg_buffer[0].find(STOP_BYTE)
                if stop_idx != -1:
                    full_msg.extend(msg_buffer[0][start_idx + 1: stop_idx])
                    state = 1
                else:
                    full_msg.extend(msg_buffer[0][start_idx + 1:])
                    state = 2
        elif state == 1:
            # Waiting STOP_BYTE
            stop_idx = msg_buffer[0].find(STOP_BYTE)
            if stop_idx != 1:
                full_msg.extend(msg_buffer[0])
            else:
                full_msg.extend(msg_buffer[0][:stop_idx])
                state = 2
        else:
            break
        msg_buffer.pop(0)
    return full_msg

def loop():
    global lora, msg_buffer, have_msg
    while True:
        # if softwareTimer.getFlag(0):
        #     msg = ping_pack(address_encode(lora.address), address_encode('ffff'))
        #     lora.send_raw_msg(msg, 'ffff', 1)
        # if softwareTimer.getFlag(1):
        #     des_addr = bytes(b'\x00\x20')
        #     des_addr_str = '0020'
        #     channel = 1
        #     msg = control_pack(des_addr, LED_ID, LED_ON)
        #     lora.send_raw_msg(msg, des_addr_str, channel)
        if have_msg:
            have_msg = False
            # Process message
            msg = process_msg()
            if len(msg) == 0:
                continue
            print(f"Message ID: {msg[0]}")
            print(f"Message content: {binascii.hexlify(msg[2:])}")
            if msg[0:1] == bytes(CONTROL_ID):
                control_msg = control_unpack(msg[1:])
                if control_msg.ctl_cmd == LED_ON:
                    led.red()
                elif control_msg.ctl_cmd == LED_OFF:
                    led.black()
        pass
    
def setup():
    global lora, timer0, msg_buffer, have_msg
    print("hello from LoRa")
    # Create LoRa instance
    lora = LoRa.LoRa()
    softwareTimer.initSoftwareTimer()
    msg_buffer = []
    have_msg = False
    
    # Initial LED
    led.init()
    
    # Timer for FSM
    timer0 = Timer(0)
    timer0.init(freq=10, mode=Timer.PERIODIC, callback=uart_callback)
    timer1 = Timer(1)
    timer1.init(period=softwareTimer.PERIOD_TICK, mode=Timer.PERIODIC, callback=softwareTimer.timerCallback)
    
    # Set software timer
    softwareTimer.setTimer(0, 500)      # send PING message
    softwareTimer.setTimer(1, 1000)     # send CONTROL message
    
def main():
    setup()
    loop()

if __name__ == "__main__":
    main()
    