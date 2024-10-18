import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as awsIOT from 'aws-iot-device-sdk';
import { IOTGatewayService } from 'src/websocket/gateway.service';

interface PayloadInterface {
  clientId: string;
  humidity: number;
  temperature: number;
  timestamp: string;
}

@Injectable()
export class EventService {
  private device;
  constructor(
    @Inject(forwardRef(() => IOTGatewayService))
    private readonly IOTGateway: IOTGatewayService,
  ) {
    // console.log(process.cwd());
    this.device = awsIOT.device({
      keyPath: 'src/certs/private.pem.key',
      certPath: 'src/certs/certificate.pem.crt',
      caPath: 'src/certs/aws_cert_ca.pem',
      clientId: 'NestJS_Client',
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
  // publishToMQTT(topic: string, message: string) {
  //   console.log('Calling publishToMQTT');
  //   this.device.publish(topic, message, (err: string) => {
  //     if (err) {
  //       console.log('Error publishing to MQTT', err);
  //     } else {
  //       console.log(`Message published to topic ${topic}`);
  //     }
  //   });
  // }
  async publishToMQTT(topic: string, message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Here');
      this.device.publish(topic, message, (err: string) => {
        if (err) {
          console.log('Error publishing to MQTT', err);
          return reject(err);
        } else {
          console.log(`Message published to topic ${topic}`);
          resolve();
        }
      });
    });
  }
}
