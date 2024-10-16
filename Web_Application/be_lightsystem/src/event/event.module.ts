import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { IOTGateway } from 'src/websocket/gateway';

@Module({
  providers: [EventService, IOTGateway],
  exports: [EventService],
})
export class EventModule {}
