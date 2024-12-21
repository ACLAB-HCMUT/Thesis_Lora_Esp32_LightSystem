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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightControlService = void 0;
const event_service_1 = require("./../event/event.service");
const common_1 = require("@nestjs/common");
let LightControlService = class LightControlService {
    constructor(eventService) {
        this.eventService = eventService;
    }
    light_control(data) {
        this.eventService.publishToMQTT('esp32_thing/light', data);
    }
};
exports.LightControlService = LightControlService;
exports.LightControlService = LightControlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_service_1.EventService])
], LightControlService);
//# sourceMappingURL=light_control.service.js.map