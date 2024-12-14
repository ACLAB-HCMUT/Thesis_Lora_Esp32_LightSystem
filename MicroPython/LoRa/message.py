import binascii

# define ID of message
PING_ID = bytes(b'\x01')
CONTROL_ID = bytes(b'\x02')
REQUEST_STATUS_ID = bytes(b'\x02')
MESSAGE_STATUS_ID = bytes(b'\x03')

# define start byte and stop byte
START_BYTE = bytes(b'!')
STOP_BYTE = bytes(b'#')

# Utils
def address_decode(address:bytes) -> str:
    return str(address)[2:-1].replace('\\x', '')

def address_encode(address:str) -> bytes:
    return binascii.unhexlify(address)
def msg2str(message:bytes) -> str:
    return str(message)[2:-1].replace('\\x', '')

# PING message
def ping_pack(address_source:bytes, address_destination:bytes) -> bytes:
    return START_BYTE + PING_ID + address_source + address_destination + STOP_BYTE

def ping_unpack(message:bytes):
    '''Unpack ping message and return tuple of address source and address destination'''
    return message[0], message[1], message[2:4], message[4:6], message[6]

# 
