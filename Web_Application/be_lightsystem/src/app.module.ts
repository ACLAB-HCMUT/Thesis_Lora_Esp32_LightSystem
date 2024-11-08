import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { IOTGatewayModule } from './websocket/gateway.module';
import { LightControlModule } from './light_control/light_control.module';

@Module({
  imports: [EventModule, IOTGatewayModule, LightControlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
