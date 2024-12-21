import { forwardRef, Module } from '@nestjs/common';
import { IOTGatewayService } from './gateway.service';
import { EventModule } from 'src/event/event.module';

@Module({
  providers: [IOTGatewayService],
  exports: [IOTGatewayService],
  imports: [forwardRef(() => EventModule)],
})
export class IOTGatewayModule {}
