

// lib/model/PayloadModel.h
// PayloadModel class definition.

#ifndef PAYLOADMODEL_H
#define PAYLOADMODEL_H

#include <Arduino.h>
#include <ArduinoJson.h>
#include <ctime>
class PayloadModel
{
private:
    String clientId;
    bool isClientIdValid;
    float humidity;
    bool isHumidityValid;
    float temperature;
    bool isTemperatureValid;
    String timeStamp;
    bool isTimeStampValid;

public:
    PayloadModel()
    {
        clientId = "";
        isClientIdValid = false;
        humidity = 0;
        isHumidityValid = false;
        temperature = 0;
        isTemperatureValid = false;
        timeStamp = "";
        isTimeStampValid = false;
    };
    void setClientId(String clientId, bool isClientIdValid)
    {
        this->clientId = clientId;
        this->isClientIdValid = isClientIdValid;
    };
    void setHumidity(float humidity, bool isHumidityValid)
    {
        this->humidity = humidity;
        this->isHumidityValid = isHumidityValid;
    };
    void setTemperature(float temperature, bool isTemperatureValid)
    {
        this->temperature = temperature;
        this->isTemperatureValid = isTemperatureValid;
    };
    void setTimeStamp(String timeStamp, bool isTimeStampValid)
    {
        this->timeStamp = timeStamp;
        this->isTimeStampValid = isTimeStampValid;
    }

    char *toJson()
    {
        static char buffer[512];
        DynamicJsonDocument doc(256);
        if (this->isClientIdValid)
        {
            doc["clientId"] = this->clientId;
        }
        else
        {
            doc["clientId"] = nullptr;
        }
        if (this->isHumidityValid)
        {
            doc["humidity"] = this->humidity;
        }
        else
        {
            doc["humidity"] = nullptr;
        }
        if (this->isTemperatureValid)
        {
            doc["temperature"] = this->temperature;
        }
        else
        {
            doc["temperature"] = nullptr;
        }
        if (this->timeStamp)
        {
            doc["timestamp"] = this->timeStamp;
        }
        else
        {
            doc["timestamp"] = nullptr;
        }

        serializeJson(doc, buffer);
        return buffer;
    };
};
#endif