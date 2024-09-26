#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <WiFi.h>

class WiFiManager
{
public:
    void connect()
    {
        const char *ssid = "YOUR_SSID";
        const char *password = "YOUR_PASSWORD";

        WiFi.begin(ssid, password);
        while (WiFi.status() != WL_CONNECTED)
        {
            delay(1000);
            Serial.println("Connecting to WiFi...");
        }
        Serial.println("Connected to WiFi");
    }
};

#endif // WIFI_MANAGER_H
