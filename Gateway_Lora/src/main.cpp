#include <WiFi.h>
#include "wifi_manager.h"
#include "firebase.h"
#include <LoRa.h>

void setup()
{
  Serial.begin(115200);

  // Connect wifi
  WiFiManager wifiManager;
  wifiManager.connect();

  // Connect Firebase
  FirebaseManager firebaseManager;
  firebaseManager.connect();

  // Init LoraMoudle
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
  int packetSize = LoRa.parsePacket();
  if (packetSize)
  {
    // Received packet from Lora Node
    String receivedData = "";
    while (LoRa.available())
    {
      receivedData += (char)LoRa.read();
    }
    Serial.print("Received: ");
    Serial.println(receivedData);

    // Gửi dữ liệu lên Firebase
    FirebaseManager firebaseManager;
    if (firebaseManager.sendData("/sensor/data", receivedData))
    {
      Serial.println("Data sent to Firebase");
    }
    else
    {
      Serial.println("Failed to send data");
    }
  }
}
