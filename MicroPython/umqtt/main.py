import os
import time
import ujson
import machine
import network
from umqtt.simple import MQTTClient

#Enter your wifi SSID and password below.
wifi_ssid = "22.08"
wifi_password = "414414a2"

#Enter your AWS IoT endpoint. You can find it in the Settings page of
#your AWS IoT Core console. 
#https://docs.aws.amazon.com/iot/latest/developerguide/iot-connect-devices.html 
aws_endpoint = b'ae1gu64w7wyef-ats.iot.ap-southeast-1.amazonaws.com'

#If you followed the blog, these names are already set.
thing_name = "esp32_thing"
client_id = "ESP_32_Device"
private_key = "private.pem.key"
private_cert = "cert.pem.crt"
ca_key = "aws_cert_ca.pem"

#Read the files used to authenticate to AWS IoT Core
with open(private_key, 'rb') as f:
    key = f.read()
    print(key)
with open(private_cert, 'rb') as f:
    cert = f.read()
with open(ca_key, 'rb') as f:
    ca = f.read()

#These are the topics we will subscribe to. We will publish updates to /update.
#We will subscribe to the /update/delta topic to look for changes in the device shadow.
# topic_pub = "$aws/things/" + thing_name + "/shadow/update"
# topic_sub = "$aws/things/" + thing_name + "/shadow/update/delta"
topic_pub = "esp32_thing/pub"
topic_sub = "esp32_thing/light"
ssl_params = {"key":key, "cert":cert, "server_side":False, "cadata": ca}

#Define pins for LED and light sensor. In this example we are using a FeatherS2.
#The sensor and LED are built into the board, and no external connections are required.
# light_sensor = machine.ADC(machine.Pin(4))
# light_sensor.atten(machine.ADC.ATTN_11DB)
# led = machine.Pin(13, machine.Pin.OUT)
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
    # if message['state']['led']:
    #     led_state(message)
    print("Done")

# def led_state(message):
#     led.value(message['state']['led']['onboard'])

#We use our helper function to connect to AWS IoT Core.
#The callback function mqtt_subscribe is what will be called if we 
#get a new message on topic_sub.
try:
    mqtt = mqtt_connect()
    mqtt.set_callback(mqtt_subscribe)
    mqtt.subscribe(topic_sub)
except:
    print("Unable to connect to MQTT.")


while True: 
#Check for messages.
    try:
        mqtt.check_msg()
    except:
        print("Unable to check for messages.")

    mesg = ujson.dumps({
        "state":{
            "reported": {
                "device": {
                    "client": client_id,
                    "uptime": time.ticks_ms(),
                    "hardware": info[0],
                    "firmware": info[2]
                },
                "sensors": {
                    "light": "30"
                },
                "led": {
                    "onboard": "30"
                }
            }
        }
    })

#Using the message above, the device shadow is updated.
    try:
        mqtt_publish(client=mqtt, message=mesg)
    except:
        print("Unable to publish message.")

#Wait for 10 seconds before checking for messages and publishing a new update.
    print("Sleep for 10 seconds")
    time.sleep(10)