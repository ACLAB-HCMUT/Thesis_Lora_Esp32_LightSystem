import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { IOTGatewayModule } from 'src/websocket/gateway.module';
@Module({
  // imports: [forwardRef(() => IOTGatewayModule)],
  imports: [forwardRef(() => IOTGatewayModule)],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
