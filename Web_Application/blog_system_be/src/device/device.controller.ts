import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Public } from 'src/decorator/publicRoute';
import { IsString } from 'class-validator';

export class InsertDeviceDto {
  @IsString()
  device_id: string;
}

export class CompareFormat {
  array1: number[];
  array2: number[];
}

@Public()
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}
  @Post('insert')
  async insert_device() {
    try {
      return this.deviceService.insert_device();
    } catch (error) {
      console.log(error);
    }
  }

  @Public()
  @Get('number_device')
  async get_number_device() {
    try {
      return this.deviceService.get_number_device();
    } catch (error) {
      console.log(error);
    }
  }

  @Public()
  @Post('get_addition_device')
  async compare_deviceID(@Body() body: CompareFormat) {
    try {
      return this.deviceService.getAddition(body.array1, body.array2);
    } catch (error) {
      console.log(error);
    }
  }

  @Public()
  @Get('device_list')
  async get_list_of_exist_id(): Promise<number[]> {
    try {
      return await this.deviceService.getAllDeviceIdsAsNumbers();
    } catch (error) {}
  }
}
