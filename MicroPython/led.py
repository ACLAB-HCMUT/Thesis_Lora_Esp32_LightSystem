from machine import Pin
from neopixel import NeoPixel

# Create Led object
led = None

def yellow():
    global led
    if led is None:
        print("Led is not initialiez")
    led[0] = (20, 20, 0)
    led.write()

def green():
    global led
    if led is None:
        print("Led is not initialiez")
    led[0] = (0, 25, 0)
    led.write()

def blue():
    global led
    if led is None:
        print("Led is not initialiez")
    led[0] = (0, 0, 25)
    led.write()

def magenta():
    global led
    if led is None:
        print("Led is not initialiez")
    led[0] = (20, 0, 20)
    led.write()

def red():
    global led
    if led is None:
        print("Led is not initialiez")
    led[0] = (25, 0, 0)
    led.write()
    
def init():
    global led
    led = NeoPixel(Pin(27, Pin.OUT), 1)
