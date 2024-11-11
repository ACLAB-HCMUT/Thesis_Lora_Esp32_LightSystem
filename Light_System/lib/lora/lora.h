#include <Arduino.h>
#include <HardwareSerial.h>

// Define UART configuration and pins
#define TX_PIN 26
#define RX_PIN 32
#define BAUD_RATE 9600

#define DEBUG true

class LoRa
{
public:
    // Define register addresses
    static const uint8_t ADD_HI = 0x00;
    static const uint8_t ADD_LO = 0x01;
    static const uint8_t REG_0 = 0x02;
    static const uint8_t REG_1 = 0x03;
    static const uint8_t REG_2 = 0x04;
    static const uint8_t REG_3 = 0x05;
    static const uint8_t CRYPT_HI = 0x06;
    static const uint8_t CRYPT_LO = 0x07;

    // Define commands
    static const uint8_t SETTING_CMD = 0xC0;
    static const uint8_t READ_CMD = 0xC1;
    static const uint8_t SETTING_TMP_CMD = 0xC2;

    // Default transmission settings
    static const uint32_t DEFAULT_BAUD_RATE = 9600;
    static const uint16_t AIR_RATE = 2400;

    // UART instance
    HardwareSerial LoRaSerial = HardwareSerial(1);

    LoRa()
    {
        LoRaSerial.begin(BAUD_RATE, SERIAL_8N1, RX_PIN, TX_PIN);
        is_config_mode = false;
    }

    void enableConfigMode()
    {
        is_config_mode = true;
    }

    void disableConfigMode()
    {
        is_config_mode = false;
    }

    void sendMsg(const String &msg)
    {
        if (DEBUG)
        {
            Serial.println("Sending message: " + msg);
        }
        LoRaSerial.write(hexStringToBytes(msg).c_str(), hexStringToBytes(msg).length());
    }

    void sendMsgTo(const String &msg, String address = "0000", uint8_t channel = 0)
    {
        if (channel > 80)
        {
            channel = 0;
        }
        String header = address + intToHex(channel);
        String package = header + msg;
        sendMsg(package);
    }

    void readReg(String address = "00", String length = "01")
    {
        if (!is_config_mode)
            return;
        String cmd = String(READ_CMD, HEX) + address + length;
        sendMsg(cmd);
    }

    void setAddress(String address)
    {
        if (!is_config_mode)
            return;
        if (!isHex(address))
        {
            Serial.println("Invalid address format");
            return;
        }
        address = padAddress(address);
        String cmd = String(SETTING_CMD, HEX) + String(ADD_HI, HEX) + "02" + address;
        sendMsg(cmd);
    }

    void setReg0(uint32_t baudrate = DEFAULT_BAUD_RATE, uint8_t parity = 0, uint16_t air_rate = AIR_RATE)
    {
        if (!is_config_mode)
            return;
        uint8_t value = 0;
        value |= getBaudRateBits(baudrate);
        value |= getParityBits(parity);
        value |= getAirRateBits(air_rate);
        String cmd = String(SETTING_CMD, HEX) + String(REG_0, HEX) + "01" + intToHex(value);
        sendMsg(cmd);
    }

    void setReg1(uint8_t packet_size = 200, bool RSSI_ambient_noise = false, uint8_t power = 22)
    {
        if (!is_config_mode)
            return;
        uint8_t value = 0;
        value |= getPacketSizeBits(packet_size);
        value |= (RSSI_ambient_noise << 5);
        value |= getPowerBits(power);
        String cmd = String(SETTING_CMD, HEX) + String(REG_1, HEX) + "01" + intToHex(value);
        sendMsg(cmd);
    }

    void setChannel(uint8_t channel)
    {
        if (!is_config_mode)
            return;
        if (channel > 80)
        {
            Serial.println("Invalid channel");
            return;
        }
        String cmd = String(SETTING_CMD, HEX) + String(REG_2, HEX) + "01" + intToHex(channel);
        sendMsg(cmd);
    }

    void setReg3(bool RSSI_byte = false, bool Transparent = true, bool LBT = false, uint16_t WOR_cycle = 500)
    {
        if (!is_config_mode)
            return;
        uint8_t value = 0;
        value |= (RSSI_byte << 7);
        value |= (!Transparent << 6);
        value |= (LBT << 5);
        value |= getWORCycleBits(WOR_cycle);
        String cmd = String(SETTING_CMD, HEX) + String(REG_3, HEX) + "01" + intToHex(value);
        sendMsg(cmd);
    }

private:
    bool is_config_mode;

    // Helper functions
    String intToHex(uint8_t num)
    {
        String hexStr = String(num, HEX);
        if (hexStr.length() < 2)
            hexStr = "0" + hexStr;
        return hexStr;
    }

    String padAddress(const String &address)
    {
        String paddedAddr = address;
        while (paddedAddr.length() < 4)
        {
            paddedAddr = "0" + paddedAddr;
        }
        return paddedAddr;
    }

    bool isHex(const String &str)
    {
        for (char c : str)
        {
            if (!isxdigit(c))
                return false;
        }
        return true;
    }

    uint8_t getBaudRateBits(uint32_t baudrate)
    {
        switch (baudrate)
        {
        case 1200:
            return 0 << 5;
        case 2400:
            return 1 << 5;
        case 4800:
            return 2 << 5;
        case 9600:
            return 3 << 5;
        case 19200:
            return 4 << 5;
        case 38400:
            return 5 << 5;
        case 57600:
            return 6 << 5;
        case 115200:
            return 7 << 5;
        default:
            return 3 << 5;
        }
    }

    uint8_t getParityBits(uint8_t parity)
    {
        return (parity == 1 ? 1 : (parity == 2 ? 2 : 0)) << 3;
    }

    uint8_t getAirRateBits(uint16_t air_rate)
    {
        switch (air_rate)
        {
        case 2400:
            return 2;
        case 4800:
            return 3;
        case 9600:
            return 4;
        case 19200:
            return 5;
        case 38400:
            return 6;
        case 62500:
            return 7;
        default:
            return 2;
        }
    }

    uint8_t getPacketSizeBits(uint8_t packet_size)
    {
        switch (packet_size)
        {
        case 200:
            return 0 << 6;
        case 128:
            return 1 << 6;
        case 64:
            return 2 << 6;
        case 32:
            return 3 << 6;
        default:
            return 0 << 6;
        }
    }

    uint8_t getPowerBits(uint8_t power)
    {
        switch (power)
        {
        case 22:
            return 0;
        case 17:
            return 1;
        case 13:
            return 2;
        case 10:
            return 3;
        default:
            return 0;
        }
    }

    uint8_t getWORCycleBits(uint16_t WOR_cycle)
    {
        int WOR_code = WOR_cycle / 500 - 1;
        return (WOR_code >= 0 && WOR_code <= 7) ? WOR_code : 0;
    }

    String hexStringToBytes(const String &hexStr)
    {
        String bytes = "";
        for (size_t i = 0; i < hexStr.length(); i += 2)
        {
            String byteString = hexStr.substring(i, i + 2);
            bytes += (char)strtol(byteString.c_str(), nullptr, 16);
        }
        return bytes;
    }
};

HardwareSerial LoRaSerial = HardwareSerial(1);
void uartCallback()
{
    if (LoRaSerial.available())
    {
        String msg = LoRaSerial.readString();
        Serial.println("Received from LoRa: " + msg);
    }
}

LoRa lora;

void setup()
{
    Serial.begin(115200);
    lora.enableConfigMode();
    lora.setAddress("1234");
    lora.setChannel(10);
    lora.setReg0(9600, 0, 2400);
    lora.setReg1(200, false, 22);
    lora.setReg3(true, false, false, 500);
    lora.disableConfigMode();
}

void loop()
{
    uartCallback();
    delay(1000);
}
