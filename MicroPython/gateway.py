from LoRa.LoRa import LoRa
from LoRa.message import *
from machine import Timer
import time
import binascii
import os
from config_aws import *
import random
topic_sub = "esp32_thing/light"
broadcast_address = bytes(b'\xff\xff')
def generate_random_string():
    # Generate a random number between 0 and 99
    random_number = random.randint(0, 99)
    # Format it as a string with two digits, prefixed by "00"
    return f"00{random_number:02d}"
def ping_callback(timer):
    # global mqtt_client
    # # msg_back = ping_pack(address_encode(lora.address),broadcast_address )
    # # lora.send_raw_msg(msg_back,address_decode(broadcast_address),int(lora.channel))
    # random_sensor = generate_random_string()
    # payload = format_package_send_server("0010","01",random_sensor)
    # mqtt_publish(client=mqtt_client,message=payload)
    pass

def uart_callback(timer):
    global lora, mqtt_client
    if lora.UART_1.any():
        # msg = binascii.hexlify(lora.UART_1.read())
        msg = (lora.UART_1.read())
        print(f"Receive from LoRa: {msg}")
        if len(msg) == 11:
            device_id = str(binascii.hexlify(msg[3:5]))[2:-1]
            light_status = str(msg[8])
            light_sensor = str(msg[9])
            print(light_status)
            payload = format_package_send_server(device_id, light_status, light_sensor)
            # print(payload, "check point")
            mqtt_publish(client=mqtt_client,topic="esp32_thing/ping",message=payload)
            
        # src_addr, des_addr = ping_unpack(msg)
        # print("source = " + address_decode(src_addr))
        # print("destination = " + address_decode(des_addr))
        # payload = format_package(address_decode(src_addr))
        # print(payload)
        # mqtt = get_mqtt()
        # mqtt_publish(client=mqtt,message=payload)
    pass

def mqtt_subscribe(topic, msg):
    print("Message received...")
    message = ujson.loads(msg)
    print(topic, message)
    print("Done")

def loop():
    global lora
    while True:
        mqtt_client.check_msg()
        time.sleep(1)
    
def setup():
    global lora, timer0, timer1, mqtt_client
    print("hello from LoRa")
    # Create LoRa instance
    lora = LoRa()
    
    # Initialize MQTT client
    mqtt_client = get_mqtt()
    mqtt_client.set_callback(mqtt_subscribe)
    mqtt_client.subscribe(topic_sub)
    print(f"Subscribed to topic: {topic_sub}")

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
    