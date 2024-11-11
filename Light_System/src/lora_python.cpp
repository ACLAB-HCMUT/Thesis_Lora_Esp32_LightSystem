// #include <Arduino.h>
// #include <lora.h>
// #include <software_timer.h>
// SoftwareTimer configTimer(1000);
// SoftwareTimer uartTimer(4000); // Timer set to 100 ms for UART checking
// LoRa lora;
// String msg;

// void setup()
// {
//     Serial.begin(9600);
//     lora.enableConfigMode();

//     // Start timers
//     configTimer.start();
//     uartTimer.start();
// }
// void checkLoRaMessages()
// {
//     if (lora.LoRaSerial.available())
//     {
//         msg = lora.LoRaSerial.readString();
//         Serial.print("Receive from LoRa: ");
//         Serial.println(msg);
//     }
// }

// void cycleConfigurations()
// {
//     // Static variable to keep track of configuration state
//     static int counter = 0;

//     switch (counter)
//     {
//     case 0:
//         lora.setAddress("0001");
//         break;
//     case 1:
//         lora.setChannel(1);
//         break;
//     default:
//         lora.setReg0(9600);
//         break;
//     }
//     counter = (counter + 1) % 3;
// }
// void loop()
// {
//     // Check if the configTimer interval has elapsed to toggle configurations
//     if (configTimer.isElapsed())
//     {
//         cycleConfigurations();
//         configTimer.reset(); // Reset the timer after handling
//     }

//     // Check if uartTimer interval has elapsed to read UART data
//     if (uartTimer.isElapsed())
//     {
//         checkLoRaMessages();
//         uartTimer.reset();
//     }
// }
