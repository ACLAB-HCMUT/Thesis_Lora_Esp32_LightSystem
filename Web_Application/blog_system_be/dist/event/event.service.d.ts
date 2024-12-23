import { DeviceService } from 'src/device/device.service';
import { IOTGatewayService } from 'src/websocket/gateway.service';
export declare class EventService {
    private readonly IOTGateway;
    private readonly deviceService;
    private device;
    constructor(IOTGateway: IOTGatewayService, deviceService: DeviceService);
    publishToMQTT(topic: string, message: any): Promise<void>;
}
