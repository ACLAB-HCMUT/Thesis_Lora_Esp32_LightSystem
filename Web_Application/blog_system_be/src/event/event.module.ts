import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { IOTGatewayModule } from 'src/websocket/gateway.module';
import { DeviceModule } from 'src/device/device.module';
@Module({
  // imports: [forwardRef(() => IOTGatewayModule)],
  imports: [forwardRef(() => IOTGatewayModule), DeviceModule],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
