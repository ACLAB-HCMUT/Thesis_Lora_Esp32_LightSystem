// #include "Arduino.h"
// #include "LoRa_E220.h"

// // Cấu hình các chân kết nối
// // #define PIN_M0 4  // M0 pin
// // #define PIN_M1 5  // M1 pin
// // #define PIN_AUX 2 // AUX pin
// #define PIN_RX 32 // RX pin (GPIO 16)
// #define PIN_TX 26 // TX pin (GPIO 17)

// #define LORA_BAUD_RATE 9600

// int Lora_Baud_Rate = 9600;
// HardwareSerial mySerial(1);
// LoRa_E220 e220(&mySerial, Lora_Baud_Rate);

// // define timer
// unsigned long previousMillis = 0;
// const long interval = 5000;
// void setup()
// {
//     Serial.begin(115200);
//     mySerial.begin(LORA_BAUD_RATE, SERIAL_8N1, PIN_RX, PIN_TX);
//     e220.begin();

//     Serial.println("LoRa E220 initialized.");
// }

// void loop()
// {
//     unsigned long currentMillis = millis();
//     if (currentMillis - previousMillis >= interval)
//     {
//         previousMillis = currentMillis;

//         e220.sendMessage("Hello from M5Stack Atom Lite!");
//         Serial.println("Message sent!");

//         if (mySerial.available())
//         {
//             String received = mySerial.readString();
//             Serial.println("Received: " + received);
//         }
//     }
// }