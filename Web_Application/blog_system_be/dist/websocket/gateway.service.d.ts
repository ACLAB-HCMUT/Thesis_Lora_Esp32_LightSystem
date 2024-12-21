import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import { EventService } from '../event/event.service';
export declare class IOTGatewayService implements OnModuleInit {
    private readonly eventService;
    server: Server;
    private clients;
    constructor(eventService: EventService);
    onModuleInit(): void;
    sendIOTData(topic: string, message: Object, nameSocket: string): void;
}
