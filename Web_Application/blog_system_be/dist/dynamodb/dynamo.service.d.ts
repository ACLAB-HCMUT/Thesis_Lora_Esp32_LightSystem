export declare class DynamoDbService {
    private dynamoDBClient;
    constructor();
    getUniqueDeviceIds(tableName: string): Promise<string[]>;
    getSensorDataByDeviceId(deviceId: string): Promise<Record<string, import("@aws-sdk/client-dynamodb").AttributeValue>[]>;
}
