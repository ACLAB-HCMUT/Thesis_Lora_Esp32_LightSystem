#include "software_timer.h"

SoftwareTimer::SoftwareTimer(unsigned long interval) : interval(interval), startTime(0), running(false) {}

void SoftwareTimer::start()
{
    startTime = millis();
    running = true;
}

void SoftwareTimer::stop()
{
    running = false;
}

bool SoftwareTimer::isElapsed()
{
    if (running && (millis() - startTime >= interval))
    {
        running = false;
        return true;
    }
    return false;
}

void SoftwareTimer::reset()
{
    start();
}

bool SoftwareTimer::isRunning()
{
    return running;
}
