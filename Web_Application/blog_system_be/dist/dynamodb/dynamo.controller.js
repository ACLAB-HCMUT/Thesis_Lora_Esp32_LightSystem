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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDbController = void 0;
const common_1 = require("@nestjs/common");
const dynamo_service_1 = require("./dynamo.service");
const publicRoute_1 = require("../decorator/publicRoute");
let DynamoDbController = class DynamoDbController {
    constructor(dynamoService) {
        this.dynamoService = dynamoService;
    }
    async getUniqueDeviceIds() {
        try {
            const deviceIds = await this.dynamoService.getUniqueDeviceIds(`${process.env.DYNAMODB_TABLE_NAME}`);
            return { deviceIds };
        }
        catch (error) {
            console.error('Error fetching device IDs:', error);
            throw error;
        }
    }
    async getSensorData(deviceId) {
        if (!deviceId) {
            throw new Error('device_id is required');
        }
        const items = await this.dynamoService.getSensorDataByDeviceId(deviceId);
        return items.map((item) => ({
            timestamp: item.timestamp,
            light_sensor_value: item.light_sensor_value,
        }));
    }
};
exports.DynamoDbController = DynamoDbController;
__decorate([
    (0, common_1.Get)('unique_deviceid'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DynamoDbController.prototype, "getUniqueDeviceIds", null);
__decorate([
    (0, common_1.Get)('device_sensor_timestamp/:device_id'),
    __param(0, (0, common_1.Param)('device_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DynamoDbController.prototype, "getSensorData", null);
exports.DynamoDbController = DynamoDbController = __decorate([
    (0, publicRoute_1.Public)(),
    (0, common_1.Controller)('dynamodb'),
    __metadata("design:paramtypes", [dynamo_service_1.DynamoDbService])
], DynamoDbController);
//# sourceMappingURL=dynamo.controller.js.map