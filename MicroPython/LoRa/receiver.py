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
        appendMessage(msg)
        if LoRa.DEBUG:
            print(f"Received message: {msg}")


def loop():
    global lora
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
        if isMessageArrived():
            # Process message
            msg = processMessage()
            print(f"length of message: {len(msg)}")
            if len(msg) == 0:
                continue
            msg_id = msg[0:1]
            print(f"Message ID: {msg_id[0]}")
            # msg = msg[1:]
            print(f"Message content: {binascii.hexlify(msg[2:])}")
            if msg_id == PING_ID:
                ping_msg = ping_unpack(msg)
                print(f"Source address: {ping_msg.getSourceAddress()}")
                print(f"Destination address: {ping_msg.getDestinationAddress()}")
                
            elif msg_id == CONTROL_ID:
                control_msg = control_unpack(msg)
                print(f"Command: {control_msg.ctl_cmd[0]}")
                if control_msg.ctl_cmd == LED_ON:
                    led.red()
                elif control_msg.ctl_cmd == LED_OFF:
                    led.black()
            elif msg_id == REQUEST_STATUS_ID:
                request_msg = request_status_unpack(msg)
                print(f"Source address: {request_msg.getSourceAddress()}")
                print(f"Destination address: {request_msg.getDestinationAddress()}")
                print(f"Object ID: {request_msg.getObject()}")
            elif msg_id == MESSAGE_STATUS_ID:
                status_msg = status_unpack(msg)
                print(f"Light state: {status_msg.getLightState()}")
                print(f"Brightness value: {status_msg.getBrightnessValue()}")
                pass
        pass
    
def setup():
    global lora, timer0, msg_buffer, have_msg
    print("hello from LoRa")
    # Create LoRa instance
    lora = LoRa.LoRa()
    softwareTimer.initSoftwareTimer()
    init_message_buffer()
    
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
    