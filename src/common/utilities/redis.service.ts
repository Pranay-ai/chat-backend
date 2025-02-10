import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, RedisClientType } from "redis";


@Injectable()
export class RedisService implements OnModuleDestroy, OnModuleInit{
    private redisClient: RedisClientType;

    constructor(private configService: ConfigService){}

    async onModuleInit() {
        this.redisClient = createClient({
            url : this.configService.get<string>('REDIS_URL', "redis://localhost:6379")
        });

        this.redisClient.on('error', (err)=> console.error('Redis Error', err))

        await this.redisClient.connect()
    }

    async set(key: string, value: string, ttl?: number) {
        await this.redisClient.set(key, value);
        if (ttl) {
          await this.redisClient.expire(key, ttl); // Set expiration time in seconds
        }
      }

    async get(key: string): Promise<string | null> {
        return this.redisClient.get(key);
      }
    
      async delete(key: string) {
        await this.redisClient.del(key);
      }
    
      async onModuleDestroy() {
        await this.redisClient.quit();
      }


}