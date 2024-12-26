from machine import Pin, const
from time import ticks_ms

BUTTON_PIN = const(39)

class Button(object):
    rest_state = False
    RELEASED = 'released'
    PRESSED = 'pressed'
    DEBOUNCE_TIME = 50

    def __init__(self, pin, rest_state = False, callback = None, internal_pullup = False, internal_pulldown = False, debounce_time = None):
        self.debounce_time = debounce_time or Button.DEBOUNCE_TIME
        if internal_pulldown:
            self.internal_pull = Pin.PULL_DOWN
            self.rest_state = False
        elif internal_pullup:
            self.internal_pull = Pin.PULL_UP
            self.rest_state = True
        else:
            self.internal_pull = None
        self.pin = Pin(pin, mode = Pin.IN, pull = self.internal_pull)
        self.callback = callback
        self.active = False

    def debounce(self):
        ms_now = ticks_ms()
        self.current_state = self.pin.value()
        state_changed = self.current_state != self.previous_state
        if state_changed:
            self.last_check_tick = ms_now
        state_stable = (ms_now - self.last_check_tick) > self.debounce_time
        if state_stable and not state_changed:
            self.last_check_tick = ms_now
            self.current_debounced_state = self.current_state
        self.previous_state = self.current_state

    def isPressed(self):
        if self.current_debounced_state != self.previous_debounced_state:
            if self.current_debounced_state != self.rest_state:
                self.active = True
                if self.callback != None:
                    self.callback(self.pin_number, Button.PRESSED)
            else:
                self.active = False
                if self.callback != None:
                    self.callback(self.pin_number, Button.RELEASED)
        self.previous_debounced_state = self.current_debounced_state
        
    def isLongPressed(self):
        pass

    def update(self):
        self.debounce()
        self.check_debounce_state()
