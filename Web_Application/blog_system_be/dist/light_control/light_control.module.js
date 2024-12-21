"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightControlModule = void 0;
const common_1 = require("@nestjs/common");
const light_control_controller_1 = require("./light_control.controller");
const light_control_service_1 = require("./light_control.service");
const event_module_1 = require("../event/event.module");
let LightControlModule = class LightControlModule {
};
exports.LightControlModule = LightControlModule;
exports.LightControlModule = LightControlModule = __decorate([
    (0, common_1.Module)({
        controllers: [light_control_controller_1.LightControlController],
        providers: [light_control_service_1.LightControlService],
        exports: [light_control_service_1.LightControlService],
        imports: [event_module_1.EventModule],
    })
], LightControlModule);
//# sourceMappingURL=light_control.module.js.map