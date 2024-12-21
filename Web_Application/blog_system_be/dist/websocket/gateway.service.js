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
exports.IOTGatewayService = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const event_service_1 = require("../event/event.service");
let IOTGatewayService = class IOTGatewayService {
    constructor(eventService) {
        this.eventService = eventService;
        this.clients = new Set();
        console.log('IOTGatewayService initialized');
    }
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log('socket ID', socket.id);
            console.log('Connected to WebSocket Server');
            this.clients.add(socket);
            socket.on('disconnect', () => {
                console.log('Disconnected from WebSocket Server');
                this.clients.delete(socket);
                console.log(`Number of connected clients: ${this.clients.size}`);
            });
        });
    }
    sendIOTData(topic, message, nameSocket) {
        this.server.emit(`${nameSocket}`, { topic, message });
    }
};
exports.IOTGatewayService = IOTGatewayService;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], IOTGatewayService.prototype, "server", void 0);
exports.IOTGatewayService = IOTGatewayService = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    }),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => event_service_1.EventService))),
    __metadata("design:paramtypes", [event_service_1.EventService])
], IOTGatewayService);
//# sourceMappingURL=gateway.service.js.map