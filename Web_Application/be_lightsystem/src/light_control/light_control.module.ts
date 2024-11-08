import { Module } from '@nestjs/common';
import { LightControlController } from './light_control.controller';
import { LightControlService } from './light_control.service';
import { EventModule } from 'src/event/event.module';
@Module({
  controllers: [LightControlController],
  providers: [LightControlService],
  exports: [LightControlService],
  imports: [EventModule],
})
export class LightControlModule {}
