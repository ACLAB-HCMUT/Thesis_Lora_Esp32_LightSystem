import { Controller, Get, Param, Query } from '@nestjs/common';
import { DynamoDbService } from './dynamo.service';
import { Public } from 'src/decorator/publicRoute';

@Public()
@Controller('dynamodb')
export class DynamoDbController {
  constructor(private readonly dynamoService: DynamoDbService) {}
  @Get('unique_deviceid')
  async getUniqueDeviceIds() {
    try {
      const deviceIds = await this.dynamoService.getUniqueDeviceIds(
        `${process.env.DYNAMODB_TABLE_NAME}`,
      );
      return { deviceIds };
    } catch (error) {
      console.error('Error fetching device IDs:', error);
      throw error;
    }
  }

  @Get('device_sensor_timestamp/:device_id')
  async getSensorData(@Param('device_id') deviceId: string) {
    if (!deviceId) {
      throw new Error('device_id is required');
    }

    const items = await this.dynamoService.getSensorDataByDeviceId(deviceId);
    // Chuyển đổi dữ liệu thành định dạng cần thiết cho biểu đồ
    return items.map((item) => ({
      timestamp: item.timestamp,
      light_sensor_value: item.light_sensor_value,
    }));
  }
}
