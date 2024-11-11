#ifndef SOFTWARETIMER_H
#define SOFTWARETIMER_H

#include <Arduino.h>

class SoftwareTimer
{
public:
    SoftwareTimer(unsigned long interval);

    void start();
    void stop();
    bool isElapsed();
    void reset();
    bool isRunning();

private:
    unsigned long interval;
    unsigned long startTime;
    bool running;
};

#endif
