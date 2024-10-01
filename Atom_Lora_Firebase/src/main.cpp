#include <M5Atom.h>
#include <FastLED.h>
#include <LoRa.h>
#include <SPI.h>
// Sender
#define ss 5
#define rst 14
#define dio0 2
CRGB leds[NUM_LEDS];
void setup()
{
  LoRa.setPins(ss, rst, dio0);
  Serial.begin(115200);
  if (Serial)
    Serial.println("Setup complete");

  M5.begin();
  M5.update();
  Serial.println("M5 Atom Lite is starting...");
  FastLED.addLeds<NEOPIXEL, 27>(leds, 1);
  leds[0] = CRGB(0x99, 0x33, 0x00);
  FastLED.show();
}

void loop()
{
  FastLED.addLeds<NEOPIXEL, 27>(leds, 1);
  leds[0] = CRGB(0x36, 0x99, 0x00);
  FastLED.show();
  delay(1000);
  FastLED.addLeds<NEOPIXEL, 27>(leds, 1);
  leds[0] = CRGB(0x4e, 0x9c, 0x8b);
  FastLED.show();
  delay(1000);
}

// #include <SPI.h>
// #include <LoRa.h>

// void setup()
// {
//   Serial.begin(115200);

//   if (!LoRa.begin(920E6))
//   {
//     Serial.println("LoRa init failed. Check your connections.");
//     while (true)
//       ;
//   }
//   Serial.println("LoRa Sender Initialized");
// }

// void loop()
// {
//   Serial.println("Sending packet...");
//   LoRa.beginPacket();
//   LoRa.print("Hello from Atom Lite");
//   LoRa.endPacket();

//   delay(5000);
// }
