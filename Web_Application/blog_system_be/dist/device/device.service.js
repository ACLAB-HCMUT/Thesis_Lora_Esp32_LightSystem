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
exports.DeviceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const device_entity_1 = require("./device.entity");
const typeorm_2 = require("typeorm");
const helper_1 = require("../ultils/helper");
let DeviceService = class DeviceService {
    constructor(DeviceReposity) {
        this.DeviceReposity = DeviceReposity;
    }
    async getAllDeviceIdsAsNumbers() {
        try {
            const devices = await this.DeviceReposity.find({
                select: ['device_id'],
            });
            const deviceIds = devices.map((device) => parseInt(device.device_id, 16));
            return deviceIds;
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to retrieve device IDs: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getRandomInt(min, max) {
        if (min > max) {
            throw new Error("The 'min' value cannot be greater than 'max'.");
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    formatDeviceID(device_id) {
        const hexValue = device_id.toString(16);
        const paddedHex = hexValue.padStart(4, '0');
        return paddedHex;
    }
    async getRandomIntExcludingExistingNumbers(min, max, excludeArrayNumbers) {
        if (min > max) {
            throw new Error("The 'min' value cannot be greater than 'max'.");
        }
        if (excludeArrayNumbers && excludeArrayNumbers.length >= max - min + 1) {
            throw new Error('All numbers in the range are excluded.');
        }
        let randomNumber;
        do {
            randomNumber = await this.getRandomInt(min, max);
        } while (excludeArrayNumbers?.includes(randomNumber));
        return this.formatDeviceID(randomNumber);
    }
    async insert_device() {
        try {
            const arrayExistDeviceID = await this.getAllDeviceIdsAsNumbers();
            const id = await this.getRandomIntExcludingExistingNumbers(2, 65534, arrayExistDeviceID);
            const new_device = {
                device_id: id,
                createAt: (0, helper_1.currentTime)(),
            };
            console.log(new_device, 'checking');
            const saveDevice = await this.DeviceReposity.save(new_device);
            if (saveDevice) {
                console.log(saveDevice);
                return {
                    id: saveDevice.device_id,
                    statusCode: common_1.HttpStatus.OK,
                    message: `Insert Device Successfully`,
                };
            }
        }
        catch (error) {
            throw error;
        }
    }
    async get_number_device() {
        const listDevice = await this.getAllDeviceIdsAsNumbers();
        return listDevice.length;
    }
    async getAddition(arr1, arr2) {
        const result = arr1.filter((num) => !arr2.includes(num));
        return result;
    }
};
exports.DeviceService = DeviceService;
exports.DeviceService = DeviceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_entity_1.DeviceEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeviceService);
//# sourceMappingURL=device.service.js.map