"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDbService = void 0;
const common_1 = require("@nestjs/common");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
let DynamoDbService = class DynamoDbService {
    constructor() {
        this.dynamoDBClient = new client_dynamodb_1.DynamoDBClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    async getUniqueDeviceIds(tableName) {
        const params = {
            TableName: tableName,
            ProjectionExpression: 'device_id',
        };
        let uniqueDeviceIds = new Set();
        let lastEvaluatedKey = null;
        do {
            const command = new client_dynamodb_1.ScanCommand(params);
            const result = await this.dynamoDBClient.send(command);
            result.Items?.forEach((item) => {
                if (item.device_id) {
                    uniqueDeviceIds.add(item.device_id.S);
                }
            });
            lastEvaluatedKey = result.LastEvaluatedKey;
            if (lastEvaluatedKey) {
                params.ExclusiveStartKey = lastEvaluatedKey;
            }
        } while (lastEvaluatedKey);
        return Array.from(uniqueDeviceIds);
    }
    async getSensorDataByDeviceId(deviceId) {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            FilterExpression: 'device_id = :device_id',
            ExpressionAttributeValues: {
                ':device_id': { S: deviceId },
            },
        };
        const command = new client_dynamodb_1.ScanCommand(params);
        const response = await this.dynamoDBClient.send(command);
        const sensorData = response.Items || [];
        const sortedSensorData = sensorData.sort((a, b) => {
            return (new Date(a.timestamp.S).getTime() - new Date(b.timestamp.S).getTime());
        });
        return sortedSensorData;
    }
};
exports.DynamoDbService = DynamoDbService;
exports.DynamoDbService = DynamoDbService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DynamoDbService);
//# sourceMappingURL=dynamo.service.js.map