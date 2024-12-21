import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from './device.entity';

@Module({
  controllers: [DeviceController],
  providers: [DeviceService],
  imports: [TypeOrmModule.forFeature([DeviceEntity])],
  exports: [DeviceService],
})
export class DeviceModule {}
