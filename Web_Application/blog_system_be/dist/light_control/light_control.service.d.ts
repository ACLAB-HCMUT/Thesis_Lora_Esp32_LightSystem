import { EventService } from './../event/event.service';
import { LightControlDto } from './dto/light_control.dto';
export declare class LightControlService {
    private readonly eventService;
    constructor(eventService: EventService);
    light_control(data: LightControlDto): void;
}
