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
exports.DeviceController = exports.CompareFormat = exports.InsertDeviceDto = void 0;
const common_1 = require("@nestjs/common");
const device_service_1 = require("./device.service");
const publicRoute_1 = require("../decorator/publicRoute");
const class_validator_1 = require("class-validator");
class InsertDeviceDto {
}
exports.InsertDeviceDto = InsertDeviceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InsertDeviceDto.prototype, "device_id", void 0);
class CompareFormat {
}
exports.CompareFormat = CompareFormat;
let DeviceController = class DeviceController {
    constructor(deviceService) {
        this.deviceService = deviceService;
    }
    async insert_device() {
        try {
            return this.deviceService.insert_device();
        }
        catch (error) {
            console.log(error);
        }
    }
    async get_number_device() {
        try {
            return this.deviceService.get_number_device();
        }
        catch (error) {
            console.log(error);
        }
    }
    async compare_deviceID(body) {
        try {
            return this.deviceService.getAddition(body.array1, body.array2);
        }
        catch (error) {
            console.log(error);
        }
    }
    async get_list_of_exist_id() {
        try {
            return await this.deviceService.getAllDeviceIdsAsNumbers();
        }
        catch (error) { }
    }
};
exports.DeviceController = DeviceController;
__decorate([
    (0, common_1.Post)('insert'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "insert_device", null);
__decorate([
    (0, publicRoute_1.Public)(),
    (0, common_1.Get)('number_device'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "get_number_device", null);
__decorate([
    (0, publicRoute_1.Public)(),
    (0, common_1.Post)('get_addition_device'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CompareFormat]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "compare_deviceID", null);
__decorate([
    (0, publicRoute_1.Public)(),
    (0, common_1.Get)('device_list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "get_list_of_exist_id", null);
exports.DeviceController = DeviceController = __decorate([
    (0, publicRoute_1.Public)(),
    (0, common_1.Controller)('device'),
    __metadata("design:paramtypes", [device_service_1.DeviceService])
], DeviceController);
//# sourceMappingURL=device.controller.js.map