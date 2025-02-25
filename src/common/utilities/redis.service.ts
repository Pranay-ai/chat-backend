import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService implements OnModuleDestroy, OnModuleInit {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: RedisClientType;
  private pubClient: RedisClientType;
  private subClient: RedisClientType;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL', "redis://localhost:6379");
    
    // Main client for key-value operations.
    this.redisClient = createClient({ url: redisUrl });
    this.redisClient.on('error', (err) => this.logger.error('Redis Error', err));
    await this.redisClient.connect();

    // Publisher client.
    this.pubClient = createClient({ url: redisUrl });
    this.pubClient.on('error', (err) => this.logger.error('Redis Publisher Error', err));
    await this.pubClient.connect();

    // Subscriber client.
    this.subClient = createClient({ url: redisUrl });
    this.subClient.on('error', (err) => this.logger.error('Redis Subscriber Error', err));
    await this.subClient.connect();

    this.logger.log('Redis clients initialized');
  }

  // Basic key-value operations.
  async set(key: string, value: string, ttl?: number) {
    await this.redisClient.set(key, value);
    if (ttl) {
      await this.redisClient.expire(key, ttl); // expiration in seconds.
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }
    
  async delete(key: string) {
    await this.redisClient.del(key);
  }

  // Pub/Sub methods.
  async publish(channel: string, message: string) {
    await this.pubClient.publish(channel, message);
  }

  async subscribe(channel: string, callback: (message: string) => void) {
    await this.subClient.subscribe(channel, (message) => {
      callback(message);
    });
  }

  // Methods for storing user socket mappings.
  async registerUserSocket(userId: string, socketId: string) {
    // Use a Redis Set to allow for multiple socketIds per user.
    await this.redisClient.sAdd(`user:sockets:${userId}`, socketId);
    this.logger.log(`Registered socket ${socketId} for user ${userId}`);
  }

  async unregisterUserSocket(userId: string, socketId: string) {
    await this.redisClient.sRem(`user:sockets:${userId}`, socketId);
    this.logger.log(`Unregistered socket ${socketId} for user ${userId}`);
  }

  async getUserSockets(userId: string): Promise<string[]> {
    return this.redisClient.sMembers(`user:sockets:${userId}`);
  }

  async onModuleDestroy() {
    await Promise.all([
      this.redisClient.quit(),
      this.pubClient.quit(),
      this.subClient.quit()
    ]);
  }
}
