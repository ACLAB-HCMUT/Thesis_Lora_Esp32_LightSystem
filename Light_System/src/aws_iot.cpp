// #include <PubSubClient.h>
// #include <WiFi.h>
// #include <WiFiClientSecure.h>

// // Định nghĩa tên Thing
// #define THING "esp32_thing"

// // Thông tin kết nối WiFi
// const char *ssid = "Meowcart Working";
// const char *password = "77777777";

// // Thông tin AWS IoT Endpoint
// const char *aws_endpoint = "ae1gu64w7wyef-ats.iot.ap-southeast-1.amazonaws.com";
// const int aws_port = 8883;

// // Các Topic MQTT
// #define PUBLISH_TOPIC "esp32_thing/pub"
// #define SUBSCRIBE_TOPIC "esp32_thing/sub"

// // Khởi tạo các đối tượng WiFi và MQTT
// WiFiClientSecure net = WiFiClientSecure();
// PubSubClient client(net);

// // Chứng chỉ CA của AWS
// const char *ca_cert = R"(
// -----BEGIN CERTIFICATE-----
// MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF
// ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6
// b24gUm9vdCBDQSAxMB4XDTE1MDUyNjAwMDAwMFoXDTM4MDExNzAwMDAwMFowOTEL
// MAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJv
// b3QgQ0EgMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJ4gHHKeNXj
// ca9HgFB0fW7Y14h29Jlo91ghYPl0hAEvrAIthtOgQ3pOsqTQNroBvo3bSMgHFzZM
// 9O6II8c+6zf1tRn4SWiw3te5djgdYZ6k/oI2peVKVuRF4fn9tBb6dNqcmzU5L/qw
// IFAGbHrQgLKm+a/sRxmPUDgH3KKHOVj4utWp+UhnMJbulHheb4mjUcAwhmahRWa6
// VOujw5H5SNz/0egwLX0tdHA114gk957EWW67c4cX8jJGKLhD+rcdqsq08p8kDi1L
// 93FcXmn/6pUCyziKrlA4b9v7LWIbxcceVOF34GfID5yHI9Y/QCB/IIDEgEw+OyQm
// jgSubJrIqg0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMC
// AYYwHQYDVR0OBBYEFIQYzIU07LwMlJQuCFmcx7IQTgoIMA0GCSqGSIb3DQEBCwUA
// A4IBAQCY8jdaQZChGsV2USggNiMOruYou6r4lK5IpDB/G/wkjUu0yKGX9rbxenDI
// U5PMCCjjmCXPI6T53iHTfIUJrU6adTrCC2qJeHZERxhlbI1Bjjt/msv0tadQ1wUs
// N+gDS63pYaACbvXy8MWy7Vu33PqUXHeeE6V/Uq2V8viTO96LXFvKWlJbYK8U90vv
// o/ufQJVtMVT8QtPHRh8jrdkPSHCa2XV4cdFyQzR1bldZwgJcJmApzyMZFo6IQ6XU
// 5MsI+yMRQ+hDKXJioaldXgjUkK642M4UwtBV8ob2xJNDd2ZhwLnoQdeXeGADbkpy
// rqXRfboQnoZsG4q5WTP468SQvvG5
// -----END CERTIFICATE-----
// )";

// // Chứng chỉ Client của AWS IoT
// const char *client_cert = R"(
// -----BEGIN CERTIFICATE-----
// MIIDWTCCAkGgAwIBAgIUQJDCYEtbizRzE24z7MZP4mB067UwDQYJKoZIhvcNAQEL
// BQAwTTFLMEkGA1UECwxCQW1hem9uIFdlYiBTZXJ2aWNlcyBPPUFtYXpvbi5jb20g
// SW5jLiBMPVNlYXR0bGUgU1Q9V2FzaGluZ3RvbiBDPVVTMB4XDTI0MTAwOTA3Mjgx
// NloXDTQ5MTIzMTIzNTk1OVowHjEcMBoGA1UEAwwTQVdTIElvVCBDZXJ0aWZpY2F0
// ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALLuZ9TxUVZ5CU6MwZE5
// N7NmEUDPHVEmROWZ30cEKqjDbT+zU77Ir6139AARcVHJhDB3iLhUaqquO5ppwGWB
// xHreoltbn708zIQzqVrHOYsqc5U2MlamUzmyFEYpCIAjshi6BxDtQUUy1jYJNqff
// jdFGFiXg/gwNB5keVXQP2ww7SgCfr7SjptQB5u8YN9YIItBDjXDSniNWvLy0oSsp
// 6xJdrr7+Dkxp6N94kGMuyGfpDPNG+xPsobEmXVuzafAcoha7uc6O0+6D51WlfwcO
// iL0hrx6MlzOPah0F9elkZielEXIYSvnrqyIW5euQx5AbpU+ZLdcuWAs57btSphxA
// 8gECAwEAAaNgMF4wHwYDVR0jBBgwFoAUxytCVz8kl+lxYQrxkeC1wSLfGMgwHQYD
// VR0OBBYEFB6llJNgPWUSRp3tkpIBlYyrtI2OMAwGA1UdEwEB/wQCMAAwDgYDVR0P
// AQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4IBAQCdxljLrN+GvJ1o5UFOXsKhM1P3
// QQVvGoTtyfT7hghRVq3JZJCpo2v1lfXWPRn2KVTU44CgcHeR1X4U8n21TPpetxUT
// 6aP2D3b+vPzdDt9c9rW4r2UIUd4JPMENfbmf1BrSC10ktIYZpb/nA6f8BWFlJJ2e
// SsYSrD1rPo5GT9FstCEGzfIuAIlOYDkq/F9qFIFA2hyx7JxgNTStemlpMSE8g7/E
// +FtjTIbAuT639TC3tf2UzSdPNqOrw8bti79MIf+Qx2yHlvAT8TCj3V/lEoTEJbug
// i1auO5W6W0IXS+csfCnHT1jcmAKLwsSTlTeOBhbo/b6zl4FTNdXKmLrKtlfi
// -----END CERTIFICATE-----
// )";

// // Khóa riêng của Client
// const char *client_key = R"(
// -----BEGIN RSA PRIVATE KEY-----
// MIIEowIBAAKCAQEAsu5n1PFRVnkJTozBkTk3s2YRQM8dUSZE5ZnfRwQqqMNtP7NT
// vsivrXf0ABFxUcmEMHeIuFRqqq47mmnAZYHEet6iW1ufvTzMhDOpWsc5iypzlTYy
// VqZTObIURikIgCOyGLoHEO1BRTLWNgk2p9+N0UYWJeD+DA0HmR5VdA/bDDtKAJ+v
// tKOm1AHm7xg31ggi0EONcNKeI1a8vLShKynrEl2uvv4OTGno33iQYy7IZ+kM80b7
// E+yhsSZdW7Np8ByiFru5zo7T7oPnVaV/Bw6IvSGvHoyXM49qHQX16WRmJ6URchhK
// +eurIhbl65DHkBulT5kt1y5YCzntu1KmHEDyAQIDAQABAoIBABG9ArwghEC/VQXd
// fF8KPhRh3PoAzlY6JgBhBbqDljsOzKjQ/U9fk9LtnlnXYNWL1bf8Uah8beqnxS7k
// pvcpKzJHGe9WoPpgqaG9gV+HepPqTHURX2IpsPx6Q/pEnRwe7cv3vTWXX64dgRDw
// TuPLjMKfYRi2Olk1fXhXgn80BzIqD+NwBQLgtwZ4G++Wf+bjYkUE9zyh0WOzEUx8
// cvbVbz9XghKx/URShgHPQ0x1n0YZVx/3lmdpXFwMDJdfHERo2wPkaoQb8Ho0iF3g
// yQG0iWr1OSbnzzYZA6PEGPmB6uu8Hk6NNZgzk1nx5A/r/HGzy9Y9xikChgtFBkZg
// 9ei7moUCgYEA7A7fv9wFcmZCTUTNNvPccQYyrIHll64WcaDUarOFU+UXqutqnCol
// kHHVuDm21ICrdhavqsJDbOV9LWiWCohYZvguV6HyAOrLHlGq8W4+Tb4RpiCf++eY
// ukbpfs2olHbEDEGOUD3qNr8HeoDkuLLe15bPdqIGfyZrl4nujtB4Sg8CgYEAwgwT
// DyLTAiS60Qm/sfvZnLt6RWMLNPjq1Cte/kSPqhlYZlNRQCiokrs1p6sHMUOx26+u
// 5sJIj2fqkh/3hVRqN9vdoYNmJkRXjlQeN5nG7TIaePg2XTOaks4fbkIdwfGJlXTN
// vxoNr+dxsJ2KCf2T5uYTvNnLAxoxsGjSSg8VUu8CgYB+feHr/0xz5tP0b7+/iKFB
// d17EDb8nrkOck9//ZT82m3Y5QnkYQYVrh3RMibCs4l3+o11ylTJoMfkH0hlEf5dP
// ZgH/N2pkj2xUTNLbGIYORqFScf0IkSvH9aO9LRr+oz2ei6pk2SieOXMac+McDc1X
// nRqCqYPtsnrI80KACLnMhQKBgQCyosL48Cookv+YaM0cYKmYa87ICcHLZktoPvUY
// Rq2q/eIvcQwfcE6fpdBjJkNcyuD1SOpObRS3UAbVtq/7Ahc2jSWfBoQHPmsMD8wx
// i1NiEPnl2zrQ2iy2cSLmMd+LJ3xtJjYycx2ejgZPfPgS8mox6iTJegY2OOr9Z8IP
// g4sx6QKBgAGmR+yY4gl4YfjsvvVQa+An9dns4tarRCy9Z2gt2323XwP9LC87uXMd
// Ewm5UJGM0BD8bhVhoblvg5CWN1itnpDZ/icxBr4YaKlyRIgTexM4GSitqdGYfr6W
// jJaHKl4VyXsHzNQvG68jnxTGvXqKlOvrovmrPik1d92WceZ470U5
// -----END RSA PRIVATE KEY-----
// )";

// // Biến để kiểm tra đã subscribe hay chưa
// bool isSubscribed = false;

// // Biến để quản lý thời gian publish
// unsigned long lastPublish = 0;
// const unsigned long publishInterval = 10000; // 10 giây

// // Hàm kết nối WiFi
// void setup_wifi()
// {
//     delay(10);
//     Serial.println();
//     Serial.print("Connecting to WiFi: ");
//     Serial.println(ssid);

//     WiFi.begin(ssid, password);

//     // Chờ kết nối
//     while (WiFi.status() != WL_CONNECTED)
//     {
//         delay(500);
//         Serial.print(".");
//     }

//     Serial.println("");
//     Serial.println("WiFi Connected");
//     Serial.print("Địa chỉ IP: ");
//     Serial.println(WiFi.localIP());
// }

// // Hàm callback để xử lý thông điệp nhận được
// void callback(char *topic, byte *payload, unsigned int length)
// {
//     Serial.print("Message arrived [");
//     Serial.print(topic);
//     Serial.print("] ");

//     // In payload
//     for (unsigned int i = 0; i < length; i++)
//     {
//         Serial.print((char)payload[i]);
//     }
//     Serial.println();
// }

// // Hàm kết nối tới AWS IoT
// void connect_to_AWS()
// {
//     net.setCACert(ca_cert);
//     net.setCertificate(client_cert);
//     net.setPrivateKey(client_key);

//     client.setServer(aws_endpoint, aws_port);
//     client.setCallback(callback);
// }

// void setup()
// {
//     Serial.begin(115200);
//     setup_wifi();
//     connect_to_AWS();
// }

// void loop()
// {
//     if (!client.connected())
//     {
//         Serial.println("Connecting to AWS...");

//         // Tạo ID client duy nhất
//         String clientId = THING;
//         clientId += String(random(0xffff), HEX);

//         // Cố gắng kết nối
//         if (client.connect(clientId.c_str()))
//         {
//             Serial.println("Successfully connected to AWS");

//             // Subscribe vào topic
//             if (client.subscribe(SUBSCRIBE_TOPIC))
//             {
//                 Serial.print("Subscribed to topic: ");
//                 Serial.println(SUBSCRIBE_TOPIC);
//                 isSubscribed = true;
//             }
//             else
//             {
//                 Serial.print("Failed to subscribe to topic: ");
//                 Serial.println(SUBSCRIBE_TOPIC);
//                 isSubscribed = false;
//             }
//         }
//         else
//         {
//             // Kết nối thất bại
//             Serial.print("Error to connect to AWS, state: ");
//             Serial.println(client.state());

//             // Đợi trước khi thử lại
//             delay(5000);
//             return;
//         }
//     }

//     // Giữ kết nối MQTT
//     client.loop();

//     // Kiểm tra và publish thông điệp mỗi 10 giây
//     unsigned long now = millis();
//     if (now - lastPublish > publishInterval)
//     {
//         lastPublish = now;

//         String message = "Hello from ESP32 at " + String(now / 1000) + " seconds";

//         if (client.publish(PUBLISH_TOPIC, message.c_str()))
//         {
//             Serial.print("Published message to ");
//             Serial.print(PUBLISH_TOPIC);
//             Serial.print(": ");
//             Serial.println(message);
//         }
//         else
//         {
//             Serial.print("Failed to publish message to ");
//             Serial.println(PUBLISH_TOPIC);
//         }
//     }
// }
