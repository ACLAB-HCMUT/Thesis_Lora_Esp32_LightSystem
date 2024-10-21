from machine import UART
from micropython import const
import binascii

DEBUG = True

class LoRa(object):
    # Define resigter of moule LoRa E220-900T22S
    # 1. Address of module in the network
    ADD_HI = const('00')
    ADD_LO = const('01')
    # 2. The register contains configuration settings for the UART baud rate, parity bit, and air data rate.
    REG_0 = const('02')
    # 3. The register contains configuration settings for the Sub-Packet Setting, Transmitting Power.
    REG_1 = const('03')
    # 4. The register contains configuration settings for the working channel of module.
    REG_2 = const('04')
    # 5. The register contains configuration settings for the Transmission.
    REG_3 = const('05')
    # 6. The register contains configuration settings for the encryption.
    CRYPT_HI = const('06')
    CRYPT_LO = const('07')

    # Define configuration command
    # 1. Setting command
    SETTING_CMD = const('C0')
    # 2. Read command
    READ_CMD = const('C1')
    # 3. Setting temporary command
    SETTING_TMP_CMD = const('C2')

    # Default setting for transmission
    BAUD_RATE = const(9600)
    PARITY_BIT = None
    AIR_RATE = const(2400)
    TX = const(26)
    RX = const(32)
    
    # Create UART instance
    UART_1 = UART(1, baudrate=BAUD_RATE, tx=TX, rx=RX, parity=PARITY_BIT)

    def __init__(self):
        self.is_config_mode = False
        
    def enable_config_mode(self):
        self.is_config_mode = True
        
    def disable_config_mode(self):
        self.is_config_mode = False
        
    def send_msg(self, msg):
        if DEBUG:
            print(f"Send message: {msg}")
        self.UART_1.write(binascii.unhexlify(msg))
    
    def send_msg_to(self, msg, address='0000', channel=0):
        # Create first 3 bytes for header
        if channel < 0 or channel > 80:
            channel = 0
        header = address + int2hex(channel)
        # Create fully package to send via LoRa
        package = binascii.unhexlify(header) + binascii.unhexlify(binascii.hexlify(msg))   # So fucking dirty
        package = binascii.hexlify(package)
        # Send package
        self.send_msg(package)
    
    def read_reg(self, address='00', length='01'):
        if not self.is_config_mode:
            return
        cmd = self.READ_CMD + address + length
        self.send_msg(cmd)
        
    def set_address(self, address:str):
        if not self.is_config_mode:
            return
        if not is_hexa(address):
            print("Wrong format address")
            return
        addr_len = len(address)
        if addr_len < 4:
            address = '0'*(4 - addr_len) + address
        elif addr_len > 4:
            # Only get 4 highest bits 
            address = address[:4]
        cmd = self.SETTING_CMD + self.ADD_HI + '02' + address
        self.send_msg(cmd)
    
    def set_reg0(self, baudrate=BAUD_RATE, parity=PARITY_BIT, air_rate=AIR_RATE):
        if not self.is_config_mode:
            return
        value = 0
        # Process UART rate
        if baudrate == 1200:
            value |= (0 << 5)
        elif baudrate == 2400:
            value |= (1 << 5)
        elif baudrate == 4800:
            value |= (2 << 5)
        elif baudrate == 9600:
            value |= (3 << 5)
        elif baudrate == 19200:
            value |= (4 << 5)
        elif baudrate == 38400:
            value |= (5 << 5)
        elif baudrate == 57600:
            value |= (6 << 5)
        elif baudrate == 115200:
            value |= (7 << 5)
        # Process parity bit
        if parity == 1:
            value |= (1 << 3)
        elif parity == 2:
            value |= (2 << 3)
        else:
            value != (0 << 3)
        # Process air rate
        if air_rate == 2400:
            value |= 2
        elif baudrate == 4800:
            value |= 3
        elif baudrate == 9600:
            value |= 4
        elif baudrate == 19200:
            value |= 5
        elif baudrate == 38400:
            value |= 6
        elif baudrate == 62500:
            value |= 7
        # Convert to hexa string 
        value = int2hex(value)
        cmd = self.SETTING_CMD + self.REG_0 + '01' + value
        self.send_msg(cmd)
        
    def set_reg1(self, packet_size=200, RSSI_ambient_noise=False, power=22):
        if not self.is_config_mode:
            return
        value = 0
        # Process maximum packet size
        if packet_size == 200:
            value |= (0 << 6)
        elif packet_size == 128:
            value |= (1 << 6)
        elif packet_size == 64:
            value |= (2 << 6)
        elif packet_size == 32:
            value |= (3 << 6)
        # Process RSSI Ambient noise enable
        # RSSI: Received Signal Strength Indicator
        if RSSI_ambient_noise:
            # You can read RSSI with command "C0C1C2C3 + address + length"
            value |= (1 << 5)
        else:
            value |= (0 << 5)
        # Process transmitting power
        if power == 22:
            value |= 0
        elif power == 17:
            value |= 1
        elif power == 13:
            value |= 2
        elif power == 10:
            value |= 3
        # Convert to hexa string
        value = int2hex(value)
        cmd = self.SETTING_CMD + self.REG_1 + '01' + value
        self.send_msg(cmd)
    
    def set_channel(self, channel):
        if not self.is_config_mode:
            return
        # Handle exception
        if channel < 0 or channel > 80:
            print("Invalid channel")
            return
        # Convert to hexa string
        channel = int2hex(channel)
        cmd = self.SETTING_CMD + self.REG_2 + '02' + channel
        self.send_msg(cmd)

    def set_reg3(self, RSSI_byte=False, Transparent=True, LBT=False, WOR_cycle=500):
        if not self.is_config_mode:
            return
        value = 0
        # Process RSSI Byte
        if RSSI_byte:
            value |= (1 << 7)
        else:
            value |= (0 << 7)
        # Process Transmission Method
        if Transparent:
            # Always broadcast
            value |= (0 << 6)
        else:
            # Use first 3 byte to define Address and channel
            value |= (1 << 6)
        # Process LBT (Listen Before Talk)
        if LBT:
            value |= (1 << 5)
        else:
            value |= (0 << 5)
        # Process WOR (Wake On Ring) Cycle
        WOR_code = (WOR_cycle // 500) - 1
        # Handle exception
        if WOR_code < 0 or WOR_code > 7:
            WOR_code = 0
        value |= WOR_code
        # Convert to hexa string
        value = int2hex(value)
        cmd = self.SETTING_CMD + self.REG_3 + '01' + value
        self.send_msg(cmd)
    

    
def is_hexa(code:str):
    try:
        binascii.unhexlify(code)
    except:
        return False
    return True

def int2hex(number):
    if number < 16:
        return '0' + hex(number)[2]
    else:
        return hex(number)[2:]

def uart_callback(timer):
    if LoRa.UART_1.any():
        msg = LoRa.UART_1.read()
        print(f"Receive from LoRa: {binascii.hexlify(msg)}")
