import { Controller, Post } from '@nestjs/common';
import { LightControlService } from './light_control.service';
@Controller('light')
export class LightControlController {
  constructor(private readonly lightcontrolservice: LightControlService) {}
  @Post('turnOn')
  turnLightOn() {
    this.lightcontrolservice.publishTurnOn({
      deviceid: '1',
      message: 'turnOn',
    });
  }

  @Post('turnOff')
  turnLightOff() {
    this.lightcontrolservice.publishTurnOff({
      deviceid: '1',
      message: 'turnOff',
    });
  }
}
