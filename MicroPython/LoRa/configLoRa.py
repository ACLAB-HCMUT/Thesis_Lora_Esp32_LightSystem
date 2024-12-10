import LoRa
from machine import Timer
import time
import binascii

NUM_CONFIG = 5
MAX_TRY = 5

def uart_callback(timer):
    global lora, msg_buffer, success
    if lora.UART_1.any():
        # msg = binascii.hexlify(lora.UART_1.read())
        msg = lora.UART_1.read()
        print(f"Receive from LoRa: {binascii.hexlify(msg)}")
        if msg != b'\xff\xff\xff':
            success += 1
    
def config():
    with open("config.txt", "r") as file_config:
        data = [line.split(' ')[1][:-2] for line in file_config.readlines()]
        lora.set_address(data[0])
        time.sleep(0.04)
        lora.set_reg0(int(data[1]), int(data[2]), int(data[3]))
        time.sleep(0.04)
        lora.set_reg1(int(data[4]), int(data[5]), int(data[6]))
        time.sleep(0.04)
        lora.set_channel(int(data[7]))
        time.sleep(0.04)
        lora.set_reg3(int(data[8]), int(data[9]), int(data[10]), int(data[11]))
        time.sleep(0.04)
    
def main():
    global success, lora
    print("hello from LoRa")
    lora = LoRa.LoRa()
    lora.enable_config_mode()
    
    # Timer for FSM
    timer0 = Timer(0)
    timer0.init(freq=100, mode=Timer.PERIODIC, callback=uart_callback)
    
    count_try = 0
    success = 0
    config()
    while success < NUM_CONFIG and count_try < MAX_TRY:
        count_try += 1
        print(f'success message = {success}')
        success = 0
        config()
    if success < NUM_CONFIG:
        print("Config fail")
    else:
        print("Config success")

if __name__ == "__main__":
    main()
    