#define LED_PIN 2
#include <Arduino.h>
#include <LittleFS.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include "../service/ConfigService.h"
#include "../model/PayloadModel.h"
#include <time.h>
#include <FastLED.h>
// setup time
CRGB leds[5];
void setupNTP()
{

    const long gmtOffset_sec = 7 * 3600; // GMT +7 (Vietnam Time)
    const int daylightOffset_sec = 0;

    // Configure NTP
    configTime(gmtOffset_sec, daylightOffset_sec, "pool.ntp.org", "time.nist.gov");
    Serial.println("Waiting for NTP time sync...");
    time_t now = time(nullptr);
    while (now < 8 * 3600 * 2)
    {
        delay(500);
        Serial.print(".");
        now = time(nullptr);
    }
    Serial.println("Time synchronized!");
}

String getCurrentTime()
{
    time_t now = time(nullptr);
    struct tm timeInfo;

    localtime_r(&now, &timeInfo);

    char timeString[25];
    strftime(timeString, sizeof(timeString), "%Y-%m-%dT%H:%M:%S%z", &timeInfo);

    return String(timeString);
}

////////////
unsigned long previousSensorMillis = 0;
const long sensorInterval = 10000;
char *payload;
WiFiClientSecure espClient;
PubSubClient client(espClient);
MqttCredentialModel mqttCredential;
WifiCredentialModel wifiCredential;
CertificateCredentialModel certificateCredential;
PayloadModel payloadModel;
void setup()
{
    Serial.begin(115200);

    // Led
    FastLED.addLeds<NEOPIXEL, 27>(leds, 1);
    leds[0] = CRGB(0x99, 0x33, 0x00);
    FastLED.show();

    Serial.println("Starting...");
    if (!LittleFS.begin())
    {
        Serial.println("An Error has occurred while mounting LittleFS");
        return;
    }

    ConfigService configService(LittleFS);
    wifiCredential = configService.getWifiCredential();
    if (wifiCredential.isEmpty())
    {
        Serial.println("Wifi credential is empty");
        return;
    }

    mqttCredential = configService.getMqttCredential();
    if (mqttCredential.isEmpty())
    {
        Serial.println("Mqtt credential is empty");
        return;
    }

    certificateCredential = configService.getCertificateCredential();
    if (certificateCredential.isEmpty())
    {
        Serial.println("Certificate credential is empty");
        return;
    }

    WiFi.begin(wifiCredential.ssid.c_str(), wifiCredential.password.c_str());
    while (WiFi.status() != WL_CONNECTED)
    {
        digitalWrite(LED_PIN, HIGH);
        delay(50);
        digitalWrite(LED_PIN, LOW);
        delay(50);
        digitalWrite(LED_PIN, HIGH);
        delay(50);
        digitalWrite(LED_PIN, HIGH);
        delay(1000);
        Serial.print(".");
    }
    Serial.println("WiFi connected");

    // Set the certificates to the client
    espClient.setCACert(certificateCredential.ca.c_str());
    espClient.setCertificate(certificateCredential.certificate.c_str());
    espClient.setPrivateKey(certificateCredential.privateKey.c_str());

    client.setServer(mqttCredential.host.c_str(), mqttCredential.port);

    while (!client.connected())
    {
        Serial.println("Connecting to AWS IoT...");

        if (client.connect(mqttCredential.clientId.c_str()))
        {
            Serial.println("Connected to AWS IoT");
        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }

    // Handle Pub/Sub
    payloadModel = PayloadModel();
    payloadModel.setClientId(mqttCredential.clientId.c_str(), true);

    // Get Current Time
    setupNTP();
}
void loop()
{

    unsigned long currentMillis = millis();
    if (currentMillis - previousSensorMillis >= sensorInterval)
    {
        digitalWrite(LED_PIN, HIGH);
        previousSensorMillis = currentMillis;
        float humidity = 2.05;
        float temperature = 3.05;
        String currentTime = getCurrentTime();
        // float humidity = dht.readHumidity();
        // float temperature = dht.readTemperature();
        payloadModel.setHumidity(humidity, !isnan(humidity));
        payloadModel.setTemperature(temperature, !isnan(temperature));
        payloadModel.setTimeStamp(currentTime, true);
        payload = payloadModel.toJson();
        Serial.println("Publish message: ");
        Serial.println(payload);
        client.publish(mqttCredential.publishTopic.c_str(), payload);
    }
}
