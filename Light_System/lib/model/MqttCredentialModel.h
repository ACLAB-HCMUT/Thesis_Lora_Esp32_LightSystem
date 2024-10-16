// lib/model/MqttCredentialModel.h
// MqttCredentialModel class definition.

#ifndef MQTTCREDENTIALMODEL_H
#define MQTTCREDENTIALMODEL_H

#include <Arduino.h>

class MqttCredentialModel
{
public:
    int port;
    String host;
    String clientId;
    String publishTopic;
    String receiveTopic; // Added receiveTopic

    // Default constructor
    MqttCredentialModel() : port(0), host(""), clientId(""), publishTopic(""), receiveTopic("") {}

    // Parameterized constructor
    MqttCredentialModel(int port, String host, String clientId, String publishTopic, String receiveTopic)
        : port(port), host(host), clientId(clientId), publishTopic(publishTopic), receiveTopic(receiveTopic) {}

    // Check if any field is empty
    bool isEmpty()
    {
        return port == 0 || host == "" || clientId == "" || publishTopic == "" || receiveTopic == "";
    }
};

#endif
