import binascii
from configParam import *

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

# Define start byte and stop byte
START_BYTE = bytes(b'!')
STOP_BYTE = bytes(b'#')

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
    
# Utils
def address_decode(address:bytes) -> str:
    return str(address)[2:-1].replace('\\x', '')
def address_encode(address:str) -> bytes:
    return binascii.unhexlify(address)

def msg2str(message:bytes) -> str:
    return str(message)[2:-1].replace('\\x', '')

# Function process message define below
# All input message have to be eliminated START_BYTE and STOP_BYTE 
# PING message
def ping_pack(address_source:bytes, address_destination:bytes) -> bytes:
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
