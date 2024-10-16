import { Injectable } from '@nestjs/common';
import * as awsIOT from 'aws-iot-device-sdk';
import { IOTGateway } from 'src/websocket/gateway';

interface PayloadInterface {
  clientId: string;
  humidity: number;
  temperature: number;
  timestamp: string;
}
@Injectable()
export class EventService {
  private device;
  constructor(private readonly IOTGateway: IOTGateway) {
    this.device = awsIOT.device({
      keyPath: '../certs/private.pem.key',
      certPath: '../certs/certificate.pem.crt',
      caPath: '../certs/aws_cert_ca.pem',
      clientId: 'uniqueClientId123',
      host: 'ae1gu64w7wyef-ats.iot.ap-southeast-1.amazonaws.com',
    });
    this.device.on('connect', () => {
      console.log('connected to AWS IOT');
      this.device.subscribe('esp32_thing/pub', (err: string) => {
        if (err) {
          console.log('Error subscribe topic');
        } else {
          console.log('subscribe topic success');
        }
      });
    });
    this.device.on('message', (topic: string, payload: PayloadInterface) => {
      const message = payload.toString();
      console.log('Message received from IOT', topic, message);
      // "message" is a namespace of socketIO
      IOTGateway.sendIOTData('test', message, 'message');
    });
  }
  publishToMQTT(topic: string, message: string) {
    this.device.publish(topic, message, (err: string) => {
      if (err) {
        console.log('Error publishing to MQTT', err);
      } else {
        console.log(`Message published to topic ${topic}`);
      }
    });
  }
}
