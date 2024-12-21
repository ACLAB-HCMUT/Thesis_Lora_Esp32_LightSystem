import { Controller, Post, Body } from '@nestjs/common';
import { LightControlService } from './light_control.service';
import { LightControlDto } from './dto/light_control.dto';
@Controller('led')
export class LightControlController {
  constructor(private readonly lightcontrolservice: LightControlService) {}

  @Post('led_status')
  light_control(@Body() data: LightControlDto) {
    this.lightcontrolservice.light_control(data);
  }
}
