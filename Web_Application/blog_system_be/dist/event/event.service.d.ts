import { IOTGatewayService } from 'src/websocket/gateway.service';
export declare class EventService {
    private readonly IOTGateway;
    private device;
    constructor(IOTGateway: IOTGatewayService);
    publishToMQTT(topic: string, message: any): Promise<void>;
}
