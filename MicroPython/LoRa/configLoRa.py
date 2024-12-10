import LoRa
from machine import Timer
import time
import binascii

ADDRESS = '0001'
CHANNEL = '01'
UART_BAUDRATE = 9600    # unit: bps
AIR_RATE = 9600         # unit: bps
TRANSPARENT = False     # Fixed transmission

def uart_callback(timer):
    global lora, msg_buffer
    if lora.UART_1.any():
        msg = binascii.hexlify(lora.UART_1.read())
        print(f"Receive from LoRa khac: {msg}")
        msg_buffer.append(msg)
        print(f"Receive from LoRa: {msg}")

def fsm_config():
    global state, lora
    if state == 0:
        # Set address of LoRa node
        lora.set_address(ADDRESS)
    elif state == 1:
        #
        pass        
    pass

def loop():
    global lora, success, state
    while True:
        if counter == 0:
            lora.set_address('0001')
            pass
        elif counter == 1:
            lora.set_channel(1)
            pass
        elif counter == 3:
            lora.set_reg0(air_rate=9600)
            pass
        elif counter == 4:
            lora.set_reg3(Transparent=False)
            print("Receiving")
            pass
        else:
            lora.send_msg_to(msg='a', address='0002', channel=1)
            pass
        counter = (counter + 1) % 6
        time.sleep(1)
        if state > 3:
            pass
        
        if len(msg_buffer) > 0:
            if msg_buffer[0] == b'ffffff':
                # Config fail => try again
                print("Wrong message format")
            else:
                # Change state to send another message
                state += 1
        else:
            # Send message
            fsm_config()
            
        time.sleep(0.04)   # 40 ms each loop to wait for response message from lora
    
def setup():
    global lora, timer0, state, msg_buffer, success
    print("hello from LoRa")
    
    # some config parameter
    msg_buffer = []
    success = False
    state = 0
    
    # Create LoRa instance
    lora = LoRa.LoRa()
    lora.enable_config_mode()
    # Timer for FSM
    timer0 = Timer(0)
    timer0.init(freq=10, mode=Timer.PERIODIC, callback=uart_callback)
    
def main():
    setup()
    loop()

if __name__ == "__main__":
    main()
    