import binascii
# Utils
def address_decode(address:bytes) -> str:
    return str(address)[2:-1]

def address_encode(address:str) -> bytes:
    return binascii.unhexlify(address)
def msg2str(message:bytes) -> str:
    return str(message)[2:-1]

# PING message
def ping_pack(address_source:bytes, address_destination:bytes) -> bytes:
    return address_source + address_destination

def ping_unpack(message:bytes):
    '''Unpack ping message and return tuple of address source and address destination'''
    return message[:2], message[2:]

# 
