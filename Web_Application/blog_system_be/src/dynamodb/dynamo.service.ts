import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/client-dynamodb';

@Injectable()
export class DynamoDbService {
  private dynamoDBClient: DynamoDBClient;

  constructor() {
    this.dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async getUniqueDeviceIds(tableName: string): Promise<string[]> {
    const params: ScanCommandInput = {
      TableName: tableName,
      ProjectionExpression: 'device_id',
    };

    let uniqueDeviceIds = new Set<string>(); // Dùng Set để loại bỏ trùng lặp
    let lastEvaluatedKey = null;

    do {
      const command = new ScanCommand(params);
      const result = await this.dynamoDBClient.send(command);

      result.Items?.forEach((item) => {
        if (item.device_id) {
          uniqueDeviceIds.add(item.device_id.S); // Thêm device_id vào Set
        }
      });

      lastEvaluatedKey = result.LastEvaluatedKey;
      if (lastEvaluatedKey) {
        params.ExclusiveStartKey = lastEvaluatedKey;
      }
    } while (lastEvaluatedKey);

    return Array.from(uniqueDeviceIds);
  }
  async getSensorDataByDeviceId(deviceId: string) {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      FilterExpression: 'device_id = :device_id',
      ExpressionAttributeValues: {
        ':device_id': { S: deviceId },
      },
    };

    const command = new ScanCommand(params);
    const response = await this.dynamoDBClient.send(command);
    const sensorData = response.Items || [];

    // Sort >  by timestamp
    const sortedSensorData = sensorData.sort((a, b) => {
      return (
        new Date(a.timestamp.S).getTime() - new Date(b.timestamp.S).getTime()
      );
    });

    return sortedSensorData;
  }
}
