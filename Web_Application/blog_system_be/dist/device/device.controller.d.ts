import { DeviceService } from './device.service';
export declare class InsertDeviceDto {
    device_id: string;
}
export declare class CompareFormat {
    array1: number[];
    array2: number[];
}
export declare class DeviceController {
    private readonly deviceService;
    constructor(deviceService: DeviceService);
    insert_device(): Promise<{
        id: string;
        statusCode: import("@nestjs/common").HttpStatus;
        message: string;
    }>;
    get_number_device(): Promise<number>;
    compare_deviceID(body: CompareFormat): Promise<number[]>;
    get_list_of_exist_id(): Promise<number[]>;
}
