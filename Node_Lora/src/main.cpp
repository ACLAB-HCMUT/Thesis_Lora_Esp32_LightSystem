#include <LoRa.h>

void setup()
{
  Serial.begin(115200);

  if (!LoRa.begin(915E6))
  {
    Serial.println("Starting LoRa failed!");
    while (1)
      ;
  }
  Serial.println("LoRa started");
}

void loop()
{
  String textToSend = "Send from node";

  Serial.println("Sending: " + textToSend);

  // Gửi dữ liệu qua LoRa
  LoRa.beginPacket();
  LoRa.print(textToSend);
  LoRa.endPacket();

  delay(2000);
}
