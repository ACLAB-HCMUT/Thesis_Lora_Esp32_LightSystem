import { EventService } from './../event/event.service';
import { Body, Injectable } from '@nestjs/common';
@Injectable()
export class LightControlService {
  constructor(private readonly eventService: EventService) {}
  publishTurnOn(@Body() data: { deviceid: string; message: string }) {
    this.eventService.publishToMQTT('esp32_thing/light', data);
  }
  publishTurnOff(@Body() data: { deviceid: string; message: string }) {
    this.eventService.publishToMQTT('esp32_thing/light', data);
  }
}
