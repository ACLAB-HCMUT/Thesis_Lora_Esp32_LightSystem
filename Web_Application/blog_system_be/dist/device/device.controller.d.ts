import { DeviceService } from './device.service';
import { DeviceEntity } from './device.entity';
export declare class InsertDeviceDto {
    device_id: string;
}
export declare class CompareFormat {
    db_arr: number[];
    new_arr: number[];
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
    get_list_of_exist_id(): Promise<number[]>;
    get_all_database(): Promise<DeviceEntity[]>;
    get_average_realtime_sensor(): Promise<any>;
}
