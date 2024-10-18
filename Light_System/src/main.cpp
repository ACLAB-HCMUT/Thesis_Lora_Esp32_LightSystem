#define LED_PIN 2
#include <Arduino.h>
#include <LittleFS.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include "../service/ConfigService.h"
#include "../model/PayloadModel.h"
#include <time.h>
#include <FastLED.h>
#include <ArduinoJson.h>
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
const long sensorInterval = 20000;
char *payload;
WiFiClientSecure espClient;
PubSubClient client(espClient);
MqttCredentialModel mqttCredential;
WifiCredentialModel wifiCredential;
CertificateCredentialModel certificateCredential;
PayloadModel payloadModel;
void messageReceived(char *topic, byte *payload, unsigned int length)
{
    Serial.println("Callback triggered!");
    Serial.print("Message arrived on topic: ");
    Serial.println(topic);
    Serial.print("Message: ");
    String message;
    for (int i = 0; i < length; i++)
    {
        message += (char)payload[i];
    }

    Serial.println("Message content: " + message);

    if (String(topic) == mqttCredential.receiveTopic)
    {
        if (message == "Turn On")
        {
            leds[0] = CRGB(0x00, 0xff, 0x00);
            FastLED.show();
        }
        else if (message == "Turn Off")
        {
            leds[0] = CRGB(0xff, 0x00, 0x00);
            FastLED.show();
        }
    }
}
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
            client.subscribe(mqttCredential.receiveTopic.c_str());
            Serial.println("Subscribed to receive topic: " + mqttCredential.receiveTopic);
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

    // Set callback from subscribe topic
    client.setCallback(messageReceived);
}
void reconnect()
{
    // Attempt to connect until successful
    while (!client.connected())
    {
        Serial.println("Connecting to AWS IoT...");
        if (client.connect(mqttCredential.clientId.c_str()))
        {
            Serial.println("Connected to AWS IoT");
            // Subscribe only if successfully connected
            client.subscribe(mqttCredential.receiveTopic.c_str());
            Serial.println("Subscribed to receive topic: " + mqttCredential.receiveTopic);
        }
        else
        {
            Serial.print("Failed to connect, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}
void loop()
{

    unsigned long currentMillis = millis();
    if (currentMillis - previousSensorMillis >= sensorInterval)
    {

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
    // receive message
    if (!client.connected())
    {
        Serial.println("MQTT client disconnected. Attempting to reconnect...");
        reconnect();
    }
    client.loop();
}
