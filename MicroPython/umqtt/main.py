import os
import time
import ujson
import machine
import network
from umqtt.simple import MQTTClient
import binascii


wifi_ssid = "ACLAB"
wifi_password = "ACLAB2023"

aws_endpoint = b'ae1gu64w7wyef-ats.iot.ap-southeast-1.amazonaws.com'

thing_name = "esp32_thing"
client_id = "ESP_32_Device"
private_key = "private.pem.key"
private_cert = "cert.pem.crt"
ca_key = "aws_cert_ca.pem"

with open(private_key, 'rb') as f:
    key = f.read()
    print(key)
with open(private_cert, 'rb') as f:
    cert = f.read()
with open(ca_key, 'rb') as f:
    ca = f.read()


ssl_params = {"key":key, "cert":cert, "server_side":False, "cadata": ca}


info = os.uname()

#Connect to the wireless network
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
if not wlan.isconnected():
    print('Connecting to network...')
    wlan.connect(wifi_ssid, wifi_password)
    while not wlan.isconnected():
        pass

    print('Connection successful')
    print('Network config:', wlan.ifconfig())

def mqtt_connect(client=client_id, endpoint=aws_endpoint, sslp=ssl_params):
    try:
        mqtt = MQTTClient(client_id=client, server=endpoint, port=8883, keepalive=1200, ssl=True, ssl_params=sslp)
        print("Connecting to AWS IoT...")
        mqtt.connect()
        print("Done")
        return mqtt
    except Exception as e:
        print(f"Error connecting to AWS IoT: {e}")
        return None



def mqtt_publish(client, topic=topic_pub, message=''):
    print("Publishing message...")
    client.publish(topic, message)
    print(message)

def mqtt_subscribe(topic, msg):
    print("Message received...")
    message = ujson.loads(msg)
    print(topic, message)
    print("Done")

def ascii_to_binary(data):
    # Chuyển từng cặp ký tự ASCII thành một byte
    try:
        binary_data = binascii.unhexlify(data)
        return binary_data
    except binascii.Error as e:
        print(f"Error converting ASCII to binary: {e}")
        return None
    
def process_data(data):
    data = list(data)
    device_id = data[0]  
    print(device_id, "device id")
    device_status = data[1]  
    print(device_status, "device status")
    light_value = data[2]  
    print(light_value, "light_value")


    return {
        "device_id": device_id,
        "status": device_status,
        "light": light_value
    }

fake_data_list = [
    b'010130',  # device_id = 1, status = 1 = on, light_value = 30
    b'020040',  # device_id = 2, status = 0 = off, light_value = 40
    b'030155',  # device_id = 3, status = 1 = on , light_value = 55
]

def process_multiple_fake_data(fake_data_list):
    parsed_data_list = []
    for fake_data_ascii in fake_data_list:
        fake_data_binary = ascii_to_binary(fake_data_ascii)
        if fake_data_binary:
            parsed_data = process_data(fake_data_binary)
            if parsed_data:
                parsed_data_list.append(parsed_data)
    return parsed_data_list


try:
    mqtt = mqtt_connect()
    mqtt.set_callback(mqtt_subscribe)
    mqtt.subscribe(topic_sub)
except:
    print("Unable to connect to MQTT.")

   
while True:
    try:
        mqtt.check_msg()
        parsed_data_list = process_multiple_fake_data(fake_data_list)
        if parsed_data_list is None:
            continue
        # for parsed_data in parsed_data_list:
        #     payload = ujson.dumps({
        #         "device_id": parsed_data["device_id"],
        #         "status": parsed_data["status"],
        #         "light_value": parsed_data["light"]
        #     })
        payload = ujson.dumps({
            "data": parsed_data_list
        })
        mqtt_publish(client=mqtt, message=payload)
    except Exception as e:
        print(f"Error in loop: {e}")

    print("Sleep for 10 seconds")
    time.sleep(10)


