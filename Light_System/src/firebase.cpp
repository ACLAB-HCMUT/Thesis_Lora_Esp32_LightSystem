// #include <PubSubClient.h>
// #define MQTT_SERVER "broker.hivemq.com" // Hoặc địa chỉ IP của broker riêng
// #define MQTT_PORT 1883
// #define MQTT_TOPIC_PUBLISH "esp32/data"
// #define MQTT_TOPIC_SUBSCRIBE "esp32/control"
// #include <Arduino.h>
// #if defined(ESP32)
// #include <WiFi.h>
// #elif defined(ESP8266)
// #include <ESP8266WiFi.h>
// #endif
// #include <Firebase_ESP_Client.h>
// // Provide the token generation process info.
// #include "addons/TokenHelper.h"
// // Provide the RTDB payload printing info and other helper functions.
// #include "addons/RTDBHelper.h"
// #include <FastLED.h>

// // Insert your network credentials
// #define WIFI_SSID "ACLAB"
// #define WIFI_PASSWORD "ACLAB2023"

// // Insert Firebase project API Key
// #define API_KEY "AIzaSyBuKRVZqCv-3RD5w-pK0vmy17FlktqtDtk"

// // Insert RTDB URLefine the RTDB URL */
// #define DATABASE_URL "https://atom-e733c-default-rtdb.asia-southeast1.firebasedatabase.app/"

// // Define Firebase Data object
// FirebaseData fbdo;

// FirebaseAuth auth;
// FirebaseConfig config;

// unsigned long sendDataPrevMillis = 0;
// int count = 0;
// bool signupOK = false;
// CRGB leds[5];
// void setup()
// {
//     Serial.begin(115200);
//     FastLED.addLeds<NEOPIXEL, 27>(leds, 1);
//     leds[0] = CRGB(0x99, 0x33, 0x00);
//     FastLED.show();
//     WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
//     Serial.print("Connecting to Wi-Fi");
//     while (WiFi.status() != WL_CONNECTED)
//     {
//         Serial.print(".");
//         delay(300);
//     }
//     Serial.println();
//     Serial.print("Connected with IP: ");
//     Serial.println(WiFi.localIP());
//     Serial.println();

//     leds[0] = CRGB(0x00, 0x80, 0x00);
//     FastLED.show();
//     /* Assign the api key (required) */
//     config.api_key = API_KEY;

//     /* Assign the RTDB URL (required) */
//     config.database_url = DATABASE_URL;

//     /* Sign up */
//     if (Firebase.signUp(&config, &auth, "", ""))
//     {
//         Serial.println("ok");
//         signupOK = true;
//     }
//     else
//     {
//         Serial.printf("%s\n", config.signer.signupError.message.c_str());
//     }

//     /* Assign the callback function for the long running token generation task */
//     config.token_status_callback = tokenStatusCallback;

//     Firebase.begin(&config, &auth);
//     Firebase.reconnectWiFi(true);
// }

// void loop()
// {
//     if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 15000 || sendDataPrevMillis == 0))
//     {
//         sendDataPrevMillis = millis();
//         // Write an Int number on the database path test/int
//         if (Firebase.RTDB.setInt(&fbdo, "test/int", count))
//         {
//             Serial.println("PASSED");
//             Serial.println("PATH: " + fbdo.dataPath());
//             Serial.println("TYPE: " + fbdo.dataType());
//         }
//         else
//         {
//             Serial.println("FAILED");
//             Serial.println("REASON: " + fbdo.errorReason());
//         }
//         count++;

//         // Write an Float number on the database path test/float
//         if (Firebase.RTDB.setFloat(&fbdo, "test/float", 0.01 + random(0, 100)))
//         {
//             Serial.println("PASSED");
//             Serial.println("PATH: " + fbdo.dataPath());
//             Serial.println("TYPE: " + fbdo.dataType());
//         }
//         else
//         {
//             Serial.println("FAILED");
//             Serial.println("REASON: " + fbdo.errorReason());
//         }
//     }
// }
