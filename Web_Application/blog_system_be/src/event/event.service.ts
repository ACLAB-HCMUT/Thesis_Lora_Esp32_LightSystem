import { forwardRef, Inject, Injectable } from '@nestjs/common';
import * as awsIOT from 'aws-iot-device-sdk';
import { DeviceService } from 'src/device/device.service';
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
    private readonly deviceService: DeviceService,
  ) {
    this.device = awsIOT.device({
      keyPath: 'src/certs/private.pem.key',
      certPath: 'src/certs/certificate.pem.crt',
      caPath: 'src/certs/aws_cert_ca.pem',
      clientId: 'NestJS_Client',
      host: 'ae1gu64w7wyef-ats.iot.ap-southeast-1.amazonaws.com',
    });
    this.device.on('connect', () => {
      console.log('connected to AWS IOT');
      this.device.subscribe('esp32_thing/ping', (err: string) => {
        if (err) {
          console.log('Error subscribe topic');
        } else {
          console.log('subscribe topic success');
        }
      });
    });
    this.device.on(
      'message',
      async (topic: string, payload: PayloadInterface) => {
        const payloadString = payload.toString();
        const parsedPayload = JSON.parse(payloadString);
        console.log(parsedPayload, 'check receive message');

        // validate input message
        const result = await this.deviceService.checkAndInsert(parsedPayload);
        console.log('check result', result);
        // "message" is a namespace of socketIO

        IOTGateway.sendIOTData('data', result, 'message');
      },
    );
  }
  async publishToMQTT(topic: string, message: any): Promise<void> {
    const messageString =
      typeof message === 'string' ? message : JSON.stringify(message);
    return new Promise((resolve, reject) => {
      this.device.publish(topic, messageString, (err: string) => {
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
