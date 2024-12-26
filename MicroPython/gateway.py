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
    global lora
    ping_package = ping_pack("ffff")
    lora.send_raw_msg(ping_package,"ffff")

def uart_callback(timer):
    global lora, mqtt_client
    if lora.UART_1.any():
        # msg = binascii.hexlify(lora.UART_1.read())
        msg = (lora.UART_1.read())
        appendMessage(msg)
        if isMessageArrived():
            msg = processMessage()
            msg_id = msg[0:1]
            msg = msg[1:]
            if msg_id == MESSAGE_STATUS_ID:
                status_msg = status_unpack(msg)
                src = str(binascii.hexlify(status_msg.src_addr))
                src = src[src.find('\'') + 1: src.rfind('\'')]
                print(f"Source address: {src}")
                print(f"Destination address: {status_msg.getDestinationAddress()}")
            payload = format_package_send_server(src, status_msg.getLightState(), str(status_msg.brightness_sensor_value[0]))
            print(payload, "check point")
            mqtt_publish(client=mqtt_client,topic="esp32_thing/ping",message=payload)

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
    init_message_buffer()
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
    