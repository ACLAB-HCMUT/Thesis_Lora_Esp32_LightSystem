from machine import Pin
from neopixel import NeoPixel
from micropython import const

# LED Pin
LED_PIN = const(27)

# Create Led object
led = None

def red():
    global led
    if led is None:
        print("Led is not initialied")
        return
    led[0] = (25, 0, 0)
    led.write()

def green():
    global led
    if led is None:
        print("Led is not initialied")
        return
    led[0] = (0, 25, 0)
    led.write()

def blue():
    global led
    if led is None:
        print("Led is not initialied")
        return
    led[0] = (0, 0, 25)
    led.write()

def yellow():
    global led
    if led is None:
        print("Led is not initialied")
        return
    led[0] = (25, 25, 0)
    led.write()


def purple():
    global led
    if led is None:
        print("Led is not initialied")
        return
    led[0] = (25, 0, 25)
    led.write()

def cyan():
    global led
    if led is None:
        print("Led is not initialied")
        return
    led[0] = (0, 25, 25)
    led.write()

def init():
    global led
    pin = Pin(LED_PIN, Pin.OUT)
    led = NeoPixel(pin, 1)
    print(f"Number of leds: {len(led)}")
