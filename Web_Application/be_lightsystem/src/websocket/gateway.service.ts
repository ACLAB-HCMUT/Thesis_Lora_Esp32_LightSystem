import { forwardRef, Inject, OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventService } from '../event/event.service';
// Have to enable cors for FE connection to WebSocket
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class IOTGatewayService implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  // To keep track of connected clients
  private clients: Set<Socket> = new Set();
  constructor(
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService,
  ) {
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

  // Handle message from Socket and publish to AWS IOT
  @SubscribeMessage('subtopic')
  handleEvent(
    @MessageBody() data: { subtopic: string; message: string },
  ): string {
    switch (data.subtopic) {
      case 'turnOn':
        console.log('turnOn Led');
        console.log(data.message);
        // this.eventService.publishToMQTT(
        //   'esp32_thing/light_sensor',
        //   data.message,
        // );
        break;
      case 'turnOff':
        console.log('turnOff Led');
        break;
      default:
        break;
    }
    // console.log(data);
    return data.message;
  }

  sendIOTData(topic: string, message: Object, nameSocket: string) {
    this.server.emit(`${nameSocket}`, { topic, message });
  }
}
