import { HttpStatus } from '@nestjs/common';
import { DeviceEntity } from './device.entity';
import { Repository } from 'typeorm';
export declare class DeviceService {
    private readonly DeviceReposity;
    constructor(DeviceReposity: Repository<DeviceEntity>);
    getAllDeviceIdsAsNumbers(): Promise<number[]>;
    getRandomInt(min: number, max: number): Promise<number>;
    formatDeviceID(device_id: number): string;
    getRandomIntExcludingExistingNumbers(min: number, max: number, excludeArrayNumbers?: number[]): Promise<string>;
    insert_device(): Promise<{
        id: string;
        statusCode: HttpStatus;
        message: string;
    }>;
    get_number_device(): Promise<number>;
    getAddition(arr1: number[], arr2: number[]): Promise<number[]>;
}
