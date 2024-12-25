import { Controller, Post, Body } from '@nestjs/common';
import { LightControlService } from './light_control.service';
import { LightControlDto } from './dto/light_control.dto';
import { Public } from 'src/decorator/publicRoute';
@Controller('led')
export class LightControlController {
  constructor(private readonly lightcontrolservice: LightControlService) {}

  @Public()
  @Post('led_status')
  light_control(@Body() data: LightControlDto) {
    this.lightcontrolservice.light_control(data);
  }
}
