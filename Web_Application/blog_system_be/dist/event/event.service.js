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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const awsIOT = require("aws-iot-device-sdk");
const device_service_1 = require("../device/device.service");
const gateway_service_1 = require("../websocket/gateway.service");
let EventService = class EventService {
    constructor(IOTGateway, deviceService) {
        this.IOTGateway = IOTGateway;
        this.deviceService = deviceService;
        this.device = awsIOT.device({
            keyPath: 'src/certs/private.pem.key',
            certPath: 'src/certs/certificate.pem.crt',
            caPath: 'src/certs/aws_cert_ca.pem',
            clientId: 'NestJS_Client',
            host: 'ae1gu64w7wyef-ats.iot.ap-southeast-1.amazonaws.com',
        });
        this.device.on('connect', () => {
            console.log('connected to AWS IOT');
            this.device.subscribe('esp32_thing/ping', (err) => {
                if (err) {
                    console.log('Error subscribe topic');
                }
                else {
                    console.log('subscribe topic success');
                }
            });
        });
        this.device.on('message', async (topic, payload) => {
            const payloadString = payload.toString();
            const parsedPayload = JSON.parse(payloadString);
            console.log(parsedPayload, 'check receive message');
            const result = await this.deviceService.checkAndInsert(parsedPayload);
            console.log('check result', result);
            IOTGateway.sendIOTData('data', result, 'message');
        });
    }
    async publishToMQTT(topic, message) {
        const messageString = typeof message === 'string' ? message : JSON.stringify(message);
        return new Promise((resolve, reject) => {
            this.device.publish(topic, messageString, (err) => {
                if (err) {
                    console.log('Error publishing to MQTT', err);
                    return reject(err);
                }
                else {
                    console.log(`Message published to topic ${topic}`);
                    resolve();
                }
            });
        });
    }
};
exports.EventService = EventService;
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => gateway_service_1.IOTGatewayService))),
    __metadata("design:paramtypes", [gateway_service_1.IOTGatewayService,
        device_service_1.DeviceService])
], EventService);
//# sourceMappingURL=event.service.js.map