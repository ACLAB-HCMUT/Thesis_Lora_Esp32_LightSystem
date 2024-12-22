import binascii
from configParam import *

# Define message buffer
message_buffer = None
have_message = False

# Define ID of message
PING_ID = bytes(b'\x01')
CONTROL_ID = bytes(b'\x02')
REQUEST_STATUS_ID = bytes(b'\x03')
MESSAGE_STATUS_ID = bytes(b'\x04')

# Ping message
MESSAGE_PING_LENGTH = bytes(b'\x04')

# Control message
MESSAGE_CONTROL_LENGTH = bytes(b'\x04')
LED_ID = bytes(b'\x01')
LED_OFF = bytes(b'\x00')
LED_ON = bytes(b'\x01')

# Request message
MESSAGE_REQUEST_STATUS_LENGTH = bytes(b'\x05')

# Status message
MESSAGE_STATUS_LENGTH = bytes(b'\x06')

# Define start byte and stop byte
START_BYTE = bytes(b'\x80')
STOP_BYTE = bytes(b'\xff')

# Define object ID dictionary
object_dict = {
    LED_ID: 'LED'
}

# Define class for each message here
class PingMessage(object):
    def __init__(self, src_addr:bytes, des_addr:bytes):
        self.src_addr = src_addr
        self.des_addr = des_addr
        
    def getSourceAddress(self) -> str:
        return address_decode(self.src_addr)
    
    def getDestinationAddress(self) -> str:
        return address_decode(self.des_addr)

class ControlMessage(object):
    def __init__(self, des_addr:bytes, obj_id:bytes, ctl_cmd:bytes):
        self.des_addr = des_addr
        self.obj_id = obj_id
        self.ctl_cmd = ctl_cmd
    
    def getDestinationAddress(self) -> str:
        return address_decode(self.des_addr)
    
class RequestStatusMessage(object):
    def __init__(self, src_addr:bytes, des_addr:bytes, obj_id:bytes):
        self.src_addr = src_addr
        self.des_addr = des_addr
        self.obj_id = obj_id
    
    def getDestinationAddress(self) -> str:
        return address_decode(self.des_addr)
    
    def getObject(self):
        if self.obj_id not in object_dict:
            print(f"Object ID is invalid")
            return None
        return object_dict[self.obj_id]
    
class StatusMessage(object):
    def __init__(self, src_addr:bytes, des_addr:bytes, light_state:bytes, brightness_sensor_value:bytes):
        self.src_addr = src_addr
        self.des_addr = des_addr
        self.light_state = light_state
        self.brightness_sensor_value = brightness_sensor_value

    def getSourceAddress(self) -> str:
        return address_decode(self.src_addr)
    
    def getDestinationAddress(self) -> str:
        return address_decode(self.des_addr)
    
    def getLightState(self) -> str:
        return address_decode(self.light_state)
    
    def getBrightnessValue(self) -> str:
        return address_decode(self.brightness_sensor_value)
    
# Utils
def address_decode(address:bytes) -> str:
    return str(address)[2:-1].replace('\\x', '')
def address_encode(address:str) -> bytes:
    return binascii.unhexlify(address)

def msg2str(message:bytes) -> str:
    return str(message)[2:-1].replace('\\x', '')

def init_message_buffer():
    global message_buffer, have_message, msg_buf_state
    message_buffer = bytearray()
    have_message = False
    
def isMessageArrived():
    global have_message
    if have_message:
        have_message = False
        return True
    return False

def appendMessage(message:bytes):
    global message_buffer, have_message
    if message_buffer is None:
        raise RuntimeError("Your have to initialize message buffer first")
    message_buffer.extend(message)
    if message_buffer.find(START_BYTE) != -1 and message_buffer.find(STOP_BYTE) != -1:
        have_message = True

def processMessage():
    global message_buffer
    start_idx = message_buffer.find(START_BYTE)
    stop_idx = message_buffer.find(STOP_BYTE)
    if start_idx == -1 or stop_idx == -1:
        print("Do not have full message in buffer")
        return None
    full_msg = message_buffer[start_idx + 1: stop_idx]
    message_buffer = message_buffer[stop_idx + 1:]
    return full_msg


# Function process message define below
# All input message have to be eliminated START_BYTE and STOP_BYTE 
# PING message
def ping_pack(address_destination:bytes) -> bytes:
    address_source = address_encode(getConfig()['address'])
    return START_BYTE + PING_ID + MESSAGE_PING_LENGTH + address_source + address_destination + STOP_BYTE

def ping_unpack(message:bytes):
    '''Unpack ping message and return PingMessage class'''
    # Format input: length + source + destination
    # Check length of body
    if message[0:1] != MESSAGE_PING_LENGTH:
        return None
    return PingMessage(message[1:3], message[3:5])

# CONTROL message
def control_pack(des_addr:bytes, obj_id:bytes, ctl_cmd:bytes) -> bytes:
    return START_BYTE + CONTROL_ID + MESSAGE_CONTROL_LENGTH + des_addr + obj_id + ctl_cmd + STOP_BYTE

def control_unpack(message:bytes):
    '''Unpack control message and return ControlMessage class'''
    # Format input: length + destination address (2 bytes) + object ID + control command
    if message[0:1] != MESSAGE_CONTROL_LENGTH:
        return None
    return ControlMessage(message[1:3], message[3:4], message[4:5])

# REQUEST message
def request_status_pack(address_destination:bytes, object_id:bytes) -> bytes:
    address_source = address_encode(getConfig()['address'])
    return START_BYTE + REQUEST_STATUS_ID + MESSAGE_REQUEST_STATUS_LENGTH + address_source + address_destination + object_id + STOP_BYTE

def request_status_unpack(message:bytes):
    '''Unpack control message and return RequestStatusMessage class'''
    # Format: length + source address (2 bytes) + destination address (2 bytes) + object ID
    if message[0:1] != MESSAGE_REQUEST_STATUS_LENGTH:
        return None
    return RequestStatusMessage(message[1:3], message[3:5], message[5:6])

# SENSOR VALUE message
def status_pack(address_destination:bytes, light_state:bytes, brightness_value:bytes) -> bytes:
    address_source = address_encode(getConfig()['address'])
    return START_BYTE + MESSAGE_STATUS_ID + MESSAGE_STATUS_LENGTH + address_source + address_destination + light_state + brightness_value + STOP_BYTE

def status_unpack(message:bytes):
    '''Unpack control message and return StatusMesage class'''
    # Format: length + source address (2 bytes) + destination address (2 bytes) + light state + brightness sensor value
    if message[0:1] != MESSAGE_STATUS_LENGTH:
        return None
    return StatusMessage(message[1:3], message[3:5], message[5:6], message[6:7])
    