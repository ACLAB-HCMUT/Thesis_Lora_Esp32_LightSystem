import time
import led

# Setup all neccesary objects
counter = 0
led.init()

def loop():
    global counter
    while True:
        if counter < 1:
            led.red()
        elif counter < 2:
            led.green()
        elif counter < 3:
            led.blue()
        elif counter < 4:
            led.yellow()
        elif counter < 5:
            led.cyan()
        elif counter < 6:
            led.purple()
        counter = (counter + 1) % 6
        time.sleep(1)
        

def main():
    print("Hello from ATOM Lite")
    loop()

if __name__ == "__main__":
    main()
    