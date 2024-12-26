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
gateway_buffer = []
TIMEOUT_RCV = 1000  # 1000 ms

def generate_random_string():
    # Generate a random number between 0 and 99
    random_number = random.randint(0, 99)
    # Format it as a string with two digits, prefixed by "00"
    return f"00{random_number:02d}"

def ping_callback(timer):
    global lora, wait_msg
    ping_package = ping_pack(b'\xff\xff')
    lora.send_raw_msg(ping_package,"ffff")
    wait_msg = 4
    
def uart_callback(timer):
    global lora, mqtt_client, gateway_buffer
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
                print(msg)
                print(f"Source address: {src}")
                print(f"Destination address: {status_msg.getDestinationAddress()}")
                print(status_msg.brightness_sensor_value, "sensor")
                payload = format_package_send_server(src, status_msg.getLightState(), str(status_msg.brightness_sensor_value[0]))
                print(payload, "check point")
                gateway_buffer += payload
                # mqtt_publish(client=mqtt_client,topic="esp32_thing/ping",message=payload)

    pass

def publish_message():
    global mqtt_client, gateway_buffer, ssl_params
    print(f"length of buffer = {len(gateway_buffer)}")
    print(gateway_buffer)
    if len(gateway_buffer) > 0:
        # Publish to mqtt
        try:
            mqtt_publish(client=mqtt_client,topic="esp32_thing/ping",message=str(gateway_buffer).replace('\'', ''))
            gateway_buffer = []
        except Exception as e:
            ssl_params = get_ssl_params()
            print(ssl_params)
            print(e)
            mqtt_client = mqtt_connect(sslp=ssl_params)


def mqtt_subscribe(topic, msg):
    global lora
    print("Message received...")
    message = ujson.loads(msg)
    print(message)
    temp = []
    # ujson.dump(message, temp)
    # print(type(message))
    print(message["status"])
    print(message["device_id"])
    # status: bytes , device_id: bytes
    status = address_encode(message["status"])
    device_id = address_encode(message["device_id"])
    control_message = control_pack(device_id,LED_ID,status)
    lora.send_raw_msg(control_message,message["device_id"])
    print("Done")

def loop():
    global lora, wait_msg, mqtt_client, ssl_params
    while True:
        try: 
            mqtt_client.check_msg()
        except Exception as e: 
            print(f"MQTT check_msg failed: {e}. Reconnecting MQTT...")
            mqtt_client = mqtt_connect(sslp=ssl_params)
        if wait_msg > 0:
            wait_msg -= 1
        elif wait_msg == 0:
            publish_message()
            wait_msg -= 1
        time.sleep(0.5)
    
def setup():
    global lora, timer0, timer1, mqtt_client, wait_msg
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
    
    # Initial time to wait message
    wait_msg = -1
    
def main():
    setup_config()
    setup()
    loop()

if __name__ == "__main__":
    main()
    