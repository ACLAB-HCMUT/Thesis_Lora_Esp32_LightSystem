import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Public } from 'src/decorator/publicRoute';
import { IsString } from 'class-validator';
import { DeviceEntity } from './device.entity';

export class InsertDeviceDto {
  @IsString()
  device_id: string;
}

export class CompareFormat {
  db_arr: number[];
  new_arr: number[];
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
  @Get('device_list')
  async get_list_of_exist_id(): Promise<number[]> {
    try {
      return await this.deviceService.getAllDeviceIdsAsNumbers();
    } catch (error) {}
  }

  @Public()
  @Get('get_all_database')
  async get_all_database(): Promise<DeviceEntity[]> {
    return await this.deviceService.getAllDatabase();
  }

  @Public()
  @Get('get_average')
  async get_average_realtime_sensor(): Promise<any> {
    const all_db = await this.deviceService.getAllDatabase();
    const filteredDb = all_db.filter((item) => item.sensor !== '0');
    const totalSensorValue = filteredDb.reduce(
      (sum, item) => sum + (item.sensor ? Number(item.sensor) : 0),
      0,
    );
    const average =
      filteredDb.length > 0 ? totalSensorValue / filteredDb.length : 0;

    return average;
  }
}
