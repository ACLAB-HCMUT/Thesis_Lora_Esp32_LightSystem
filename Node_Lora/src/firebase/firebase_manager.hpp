#ifndef FIREBASE_H
#define FIREBASE_H

#include <FirebaseESP32.h>

#define FIREBASE_HOST "your-project-id.firebaseio.com"
#define FIREBASE_AUTH "your-database-secret"

class FirebaseManager
{
public:
    FirebaseData firebaseData;

    void connect()
    {
        Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
        Firebase.reconnectWiFi(true);
    }

    bool sendData(const String &path, const String &data)
    {
        return Firebase.setString(firebaseData, path, data);
    }
};

#endif // FIREBASE_H
