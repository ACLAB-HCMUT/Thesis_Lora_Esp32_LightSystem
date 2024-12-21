import { LightControlService } from './light_control.service';
import { LightControlDto } from './dto/light_control.dto';
export declare class LightControlController {
    private readonly lightcontrolservice;
    constructor(lightcontrolservice: LightControlService);
    light_control(data: LightControlDto): void;
}
