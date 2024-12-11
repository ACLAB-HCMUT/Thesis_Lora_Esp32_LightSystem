import LoRa
from configParam import getConfig
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
    lora.set_address(getConfig()['address'])
    time.sleep(0.04)
    lora.set_reg0(int(getConfig()['UART_rate']), int(getConfig()['parity_bit']), int(getConfig()['air_rate']))
    time.sleep(0.04)
    lora.set_reg1(int(getConfig()['package_length']), int(getConfig()['RSSI_noise']), int(getConfig()['power']))
    time.sleep(0.04)
    lora.set_channel(int(getConfig()['channel']))
    time.sleep(0.04)
    lora.set_reg3(int(getConfig()['RSSI_data']), int(getConfig()['Transmission']), int(getConfig()['LBT']), int(getConfig()['WOR_cycle']))
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
    