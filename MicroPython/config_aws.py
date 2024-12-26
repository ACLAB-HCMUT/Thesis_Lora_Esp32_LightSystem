import os
import time
import ujson
import machine
import network
from umqtt.simple import MQTTClient
import binascii
# from datetime import datetime, timedelta, timezone
wifi_ssid = "22.08"
wifi_password = "414414a2"
aws_endpoint = b'ae1gu64w7wyef-ats.iot.ap-southeast-1.amazonaws.com'
thing_name = "esp32_thing"
client_id = "ESP_32_Device"
private_key = "private.pem.key"
private_cert = "cert.pem.crt"
ca_key = "aws_cert_ca.pem"
topic_pub = "esp32_thing/ping"
topic_sub = "esp32_thing/light"


def mqtt_connect(client=client_id, endpoint=aws_endpoint, sslp=None):
    try:
        mqtt = MQTTClient(client_id=client, server=endpoint, port=8883, keepalive=1200, ssl=True, ssl_params=sslp)
        print("Connecting to AWS IoT...")
        mqtt.connect()
        print("Done")
        return mqtt
    except Exception as e:
        print(f"Error connecting to AWS IoT: {e}")
        return None

# client = mqtt
def mqtt_publish(client, topic=topic_pub, message=''):
    print("Publishing message...")
    client.publish(topic, message)
    print(message)

def mqtt_subscribe(topic, msg):
    print("Message received...")
    message = ujson.loads(msg)
    print(topic, message)
    print("Done")

def format_package_send_server(src_address,status,sensor_light):
    package = []
    sub_package = ujson.dumps({
        "device_id": src_address,
        "status": status,
        "sensor": sensor_light,
        "timestamp": "test"
    })
    package.insert(sub_package)
    return package


def get_mqtt():
    global mqtt
    return mqtt

def setup_config():
    global mqtt
    # Get Key
    with open(private_key, 'rb') as f:
        key = f.read()
    with open(private_cert, 'rb') as f:
        cert = f.read()
    with open(ca_key, 'rb') as f:
        ca = f.read()
    # Make an object
    ssl_params = {"key":key, "cert":cert, "server_side":False, "cadata": ca}

    # info = os.uname()
    # Connect to Wifi
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print('Connecting to network...')
        wlan.connect(wifi_ssid, wifi_password)
        while not wlan.isconnected():
            pass

        print('Connection successful')
        print('Network config:', wlan.ifconfig())
    # Setup MQTT
    mqtt = mqtt_connect(sslp=ssl_params)

    
def main_config():
    setup_config()

if __name__ == "__main__":
    main_config()
    