import { DynamoDbService } from './dynamo.service';
export declare class DynamoDbController {
    private readonly dynamoService;
    constructor(dynamoService: DynamoDbService);
    getUniqueDeviceIds(): Promise<{
        deviceIds: string[];
    }>;
    getSensorData(deviceId: string): Promise<{
        timestamp: import("@aws-sdk/client-dynamodb").AttributeValue;
        light_sensor_value: import("@aws-sdk/client-dynamodb").AttributeValue;
    }[]>;
}
