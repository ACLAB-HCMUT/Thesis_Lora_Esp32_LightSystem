import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { IOTGatewayModule } from './websocket/gateway.module';

@Module({
  imports: [EventModule, IOTGatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
