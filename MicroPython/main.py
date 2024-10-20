import time
from LedRGB import led

# Setup all neccesary objects
counter = 0
led.init()

def loop():
    global counter
    while True:
        # turn on red led within 3 seconds and switch to blue within 3 seconds
        if counter < 3:
            led.red()
        elif counter < 6:
            led.blue()
        else:
            counter = -1
        counter += 1
        time.sleep(1)
        

def main():
    print("Hello from ATOM Lite")
    loop()

if __name__ == "__main__":
    main()
    