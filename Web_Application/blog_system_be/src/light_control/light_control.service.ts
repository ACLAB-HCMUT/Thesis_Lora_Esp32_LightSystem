import { EventService } from './../event/event.service';
import { Body, Injectable } from '@nestjs/common';
import { LightControlDto } from './dto/light_control.dto';
@Injectable()
export class LightControlService {
  constructor(private readonly eventService: EventService) {}
  light_control(data: LightControlDto) {
    this.eventService.publishToMQTT('esp32_thing/light', data);
  }
}
