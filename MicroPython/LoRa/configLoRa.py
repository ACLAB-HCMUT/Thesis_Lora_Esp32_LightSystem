import LoRa
from machine import Timer
import time
import binascii

def uart_callback(timer):
    global lora, msg
    if lora.UART_1.any():
        msg = binascii.hexlify(lora.UART_1.read())
        print(f"Receive from LoRa khac: {msg}")


def loop():
    global lora
    counter = 0
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
    
def setup():
    global lora, timer0
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
    