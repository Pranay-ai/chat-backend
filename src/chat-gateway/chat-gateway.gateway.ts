import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayInit, OnGatewayDisconnect } from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { RedisService } from 'src/common/utilities/redis.service';
import { ChatService } from 'src/chat/chat.service';


@WebSocketGateway({
  cors: { 
    origin: "*",
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  namespace: '/',
})
export class ChatGatewayGateway implements OnGatewayInit, OnGatewayDisconnect {
  private logger = new Logger('ChatGateway');
  // Track locally which chat channels have been subscribed to (avoid duplicate subscriptions on this server)
  private subscribedChannels: Set<string> = new Set();

  @WebSocketServer() server: Server;

  constructor(
    private redisService: RedisService,
    private chatService: ChatService
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    const { userId } = client.handshake.query as { userId: string };

    // Placeholder authentication logic.
    const isAuthenticated = true;
    if (!isAuthenticated) {
      return client.disconnect();
    }

    this.logger.log(`Client connected: ${client.id} with userId: ${userId}`);

    // Register the user's socket in Redis.
    await this.redisService.registerUserSocket(userId, client.id);

    // Set the online status in Redis.
    await this.redisService.set(`user:online:${userId}`, 'true');

    // Assume we have a way to get the chat IDs (rooms) for the user.
    // For example, this could come from a database query.
    const userChats: any[] = await this.chatService.getChatsByUser(userId, null);

    console.log(userChats);
    
    // Subscribe the socket to each chat (both in Socket.IO and subscribe to Redis channels)
    for (const chatId of userChats) {
      client.join(chatId);
      this.logger.log(`User ${userId} joined room ${chatId}`);
      
      // Subscribe to the Redis channel for this chat if not already done on this server instance.
      if (!this.subscribedChannels.has(chatId)) {
        this.subscribedChannels.add(chatId);
        await this.redisService.subscribe(chatId, (message: string) => {
          // Broadcast the message to all sockets in the room.
          this.server.to(chatId).emit('message', { chatId, message });
          this.logger.log(`Broadcasted Redis message on channel ${chatId}: ${message}`);
        });
      }
    }

    // Notify client of successful connection.
    client.emit('connection_status', { 
      status: 'connected',
      clientId: client.id,
      message: 'Successfully connected to WebSocket server'
    });
  }

  async handleDisconnect(client: Socket) {
    const { userId } = client.handshake.query as { userId: string };

    // Unregister the socket from Redis.
    await this.redisService.unregisterUserSocket(userId, client.id);

    // Remove the user's online status. (Optionally, you may want to check if the user has other active sockets before doing this.)
    await this.redisService.delete(`user:online:${userId}`);

    this.logger.log(`User ${userId} disconnected. Cleaned up socket: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket, message: any) {
    this.logger.log(`Ping received from ${client.id}: ${JSON.stringify(message)}`);
    client.emit('pong', { data: 'Server is alive' });
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    this.logger.log(`Message received from ${client.id}: ${JSON.stringify(payload)}`);
    // Process the message:
    // 1. Persist the message if needed.
    // 2. Publish it via Redis so that all servers can forward it.
    this.redisService.publish(payload.chatId, payload.message)
      .then(() => this.logger.log(`Published message for chat ${payload.chatId}`))
      .catch(err => this.logger.error('Error publishing message', err));

    return { event: 'message', data: 'Message received' };
  }

 
}
